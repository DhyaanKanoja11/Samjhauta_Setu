# risk/clause_splitter.py

import re


def split_into_clauses(text):
    """
    Splits contract into logical clauses.
    Works for multilingual text.
    """

    # Split by common legal separators
    clauses = re.split(r'\n+|\.\s+|;\s+|\d+\.\s+', text)

    # Remove very short noise clauses
    cleaned = [c.strip() for c in clauses if len(c.strip()) > 30]

    return cleaned
