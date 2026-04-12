import re
from typing import List, Dict, Any
from langdetect import detect
from deep_translator import GoogleTranslator

# --- Core Data (Consolidated from keywords.py) ---

RISK_KEYWORDS = {
    "en": [
        "terminate", "sole discretion", "no notice", "reject", "penalty", 
        "liability", "exclusive", "dispute", "court", "arbitration",
        "forfeit", "non-refundable", "at will", "unilateral"
    ],
    "hi": [
        "समाप्त", "विवेक", "सूचना नहीं", "अस्वीकार", "जुर्माना",
        "दायित्व", "विवाद", "अदालत", "मध्यस्थता", "जब्त"
    ],
    "gu": [
        "સમાપ્ત", "વિવેકબુદ્ધિ", "નોટિસ વગર", "અસ્વીકાર", "દંડ",
        "જવાબદારી", "વિવાદ", "કોર્ટ", "મધ્યસ્થતા", "જપ્ત"
    ]
}

RISK_WEIGHTS = {
    "sole discretion": 5,
    "no notice": 4,
    "reject": 3,
    "penalty": 4,
    "unilateral": 5,
    "at will": 4,
    "forfeit": 3,
    "court": 2,
    "arbitration": 2
}

PATTERN_RULES = {
    "buyer_discretion": {
        "pattern": r"(buyer|purchaser).*(sole discretion|at will|unilateral)",
        "weight": 5,
        "description": "The buyer has total control over decisions."
    },
    "no_notice_termination": {
        "pattern": r"(terminate).*(without notice|no notice|effective immediately)",
        "weight": 5,
        "description": "Agreement can be ended instantly without warning."
    },
    "quality_rejection": {
        "pattern": r"(reject|refuse).*(discretion|without reason|buyer decides)",
        "weight": 4,
        "description": "Buyer can reject your crop based on their own judgment."
    }
}

# --- Internal Helper Functions ---

def detect_language(text: str) -> str:
    try:
        lang = detect(text)
        return lang if lang in ["en", "hi", "gu"] else "en"
    except:
        return "en"

def split_into_clauses(text: str) -> List[str]:
    # Splitting by common sentence or paragraph markers
    clauses = re.split(r'\n+|(?<=[.!?])\s+', text)
    return [c.strip() for c in clauses if len(c.strip()) > 10]

def calculate_clause_risk(clause: str, language: str) -> Dict[str, Any]:
    text_lower = clause.lower()
    keywords = RISK_KEYWORDS.get(language, RISK_KEYWORDS["en"])

    score = 0
    flags = []

    # 1. Keyword Check
    for word in keywords:
        if word.lower() in text_lower:
            weight = RISK_WEIGHTS.get(word.lower(), 1)
            score += weight
            flags.append({"type": "keyword", "term": word, "weight": weight})

    # 2. Pattern Check (Regex)
    for rule_name, rule in PATTERN_RULES.items():
        if re.search(rule["pattern"], text_lower):
            score += rule["weight"]
            flags.append({
                "type": "pattern",
                "rule": rule_name, 
                "description": rule["description"], 
                "weight": rule["weight"]
            })

    return {"score": score, "flags": flags}

# --- Main Analysis Function ---

def analyze_contract(text: str, output_lang: str = "en"):
    """
    Core engine for identifying risks in contract text.
    """
    if not text.strip():
        return {"risk_score": 0, "risk_level": "LOW", "risky_clauses": []}

    detected_lang = detect_language(text)
    clauses = split_into_clauses(text)

    total_score = 0
    risky_clauses = []

    for clause in clauses:
        analysis = calculate_clause_risk(clause, detected_lang)
        
        if analysis["score"] > 0:
            total_score += analysis["score"]
            risky_clauses.append({
                "text": clause[:500],
                "score": analysis["score"],
                "flags": analysis["flags"]
            })

    # Determine Risk Level
    if total_score == 0:
        level = "LOW"
    elif total_score <= 8:
        level = "MEDIUM"
    else:
        level = "HIGH"

    return {
        "risk_score": total_score,
        "risk_level": level,
        "detected_language": detected_lang,
        "risky_clauses": risky_clauses
    }
