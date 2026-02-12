# risk/explainer.py

EXPLANATION_MAP = {
    "sole discretion": "Buyer can make decisions without your approval.",
    "unilateral": "Only one side can change terms.",
    "non-refundable": "Money paid may not be returned.",
    "reject": "Buyer can reject your crop.",
    "withhold payment": "Payment can be delayed or stopped.",
    "blacklist": "You may be banned from future contracts.",
    "indemnify": "You may have to pay for buyer’s losses.",
}


def generate_clause_explanation(flags):
    explanations = []

    for flag in flags:
        if flag["type"] == "keyword":
            term = flag["term"].lower()
            if term in EXPLANATION_MAP:
                explanations.append(EXPLANATION_MAP[term])

        if flag["type"] == "pattern":
            explanations.append(flag.get("description", ""))

    return list(set(explanations))
