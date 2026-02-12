# risk/risk_engine.py

import re
from .keywords import RISK_KEYWORDS, RISK_WEIGHTS
from .language_detect import detect_language
from .clause_splitter import split_into_clauses
from .explainer import generate_clause_explanation

PATTERN_RULES = {
    "buyer_may_discretion": {
        "pattern": r"(buyer|purchaser).*(sole discretion)",
        "weight": 4,
        "description": "Buyer has sole decision power."
    },
    "reject_without_reason": {
        "pattern": r"(reject|refuse).*(without reason)",
        "weight": 4,
        "description": "Buyer can reject crop without justification."
    },
    "payment_delay": {
        "pattern": r"(payment).*(after sale|at buyer convenience)",
        "weight": 3,
        "description": "Payment may be delayed."
    }
}


def calculate_clause_risk(clause, language):
    text_lower = clause.lower()
    keywords = RISK_KEYWORDS.get(language, RISK_KEYWORDS["en"])

    score = 0
    flags = []

    # Keyword-based scoring
    for word in keywords:
        if re.search(re.escape(word.lower()), text_lower):
            weight = RISK_WEIGHTS.get(word.lower(), 1)
            score += weight
            flags.append({
                "type": "keyword",
                "term": word,
                "weight": weight
            })

    # Pattern-based scoring
    for rule_name, rule in PATTERN_RULES.items():
        if re.search(rule["pattern"], text_lower):
            score += rule["weight"]
            flags.append({
                "type": "pattern",
                "rule": rule_name,
                "description": rule["description"],
                "weight": rule["weight"]
            })

    return score, flags


def classify_risk(score):
    if score == 0:
        return "LOW"
    elif score <= 5:
        return "MEDIUM"
    else:
        return "HIGH"


def analyze_contract(text, output_lang="en"):
    if not text.strip():
        return {
            "risk_score": 0,
            "risk_level": "LOW",
            "clauses": [],
            "detected_language": "unknown"
        }

    detected_language = detect_language(text)
    clauses = split_into_clauses(text)

    total_score = 0
    clause_results = []

    for clause in clauses:
        score, flags = calculate_clause_risk(clause, detected_language)
        explanations = generate_clause_explanation(flags)
        if score > 0:
            clause_results.append({
                "clause_text": clause[:300],
                "clause_score": score,
                "flags": flags,
                "explanations": explanations
            })

        total_score += score

    overall_level = classify_risk(total_score)

    return {
        "risk_score": total_score,
        "risk_level": overall_level,
        "detected_language": detected_language,
        "risky_clauses": clause_results
    }
