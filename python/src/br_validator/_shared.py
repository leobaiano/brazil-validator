"""Small helpers reused by more than one validator.

Private (leading underscore): these are implementation details, not part
of the public API of any validator module.
"""

import re

_NON_DIGITS = re.compile(r"\D")


def remove_non_digits(value: str) -> str:
    """Strip every character that is not 0-9."""
    return _NON_DIGITS.sub("", value)


# Anatel's Plano de Numeração Brasileiro: exactly 67 valid DDD (area) codes,
# not every two-digit value from 11-99.
VALID_DDDS = {
    "11", "12", "13", "14", "15", "16", "17", "18", "19",
    "21", "22", "24",
    "27", "28",
    "31", "32", "33", "34", "35", "37", "38",
    "41", "42", "43", "44", "45", "46", "47", "48", "49",
    "51", "53", "54", "55",
    "61", "62", "63", "64", "65", "66", "67", "68", "69",
    "71", "73", "74", "75", "77", "79",
    "81", "82", "83", "84", "85", "86", "87", "88", "89",
    "91", "92", "93", "94", "95", "96", "97", "98", "99",
}
