from .translator import safe_translate

def generate_summary(category_scores, output_lang):
    if not category_scores:
        return safe_translate("No major risky clauses detected.", output_lang)

    dominant = max(category_scores, key=category_scores.get)

    summary_map = {
        "control": "The contract gives significant control to the buyer.",
        "payment": "There may be payment delay or refund risks.",
        "financial": "There are possible financial penalties.",
        "quality": "Buyer has strong crop rejection rights.",
        "legal": "Disputes may not go through normal courts."
    }

    summary = summary_map.get(dominant, "Multiple risks detected.")
    return safe_translate(summary, output_lang)
