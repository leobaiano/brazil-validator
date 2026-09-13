"""Validates, normalizes, and formats Brazilian CNPJ numbers.

Covers both the traditional numeric format and the alphanumeric format
introduced by Receita Federal.
"""

import re

_ALLOWED_CHARS = re.compile(r"^[A-Za-z0-9.\-/\s]+$")
_FORMATTING_CHARS = re.compile(r"[.\-/\s]")
_NORMALIZED_SHAPE = re.compile(r"^[A-Z0-9]{12}\d{2}$")


def normalize(value: str) -> str:
    """Strip formatting and uppercase value.

    A digit-only strip would destroy alphanumeric CNPJ values, so only
    separator characters are removed.
    """
    return _FORMATTING_CHARS.sub("", value).upper()


def _character_value(char: str) -> int:
    return ord(char) - 48


def _calculate_check_digit(value: str) -> int:
    total = 0
    weight = 5 if len(value) == 12 else 6

    for char in value:
        total += _character_value(char) * weight
        weight -= 1

        if weight == 1:
            weight = 9

    remainder = total % 11

    if remainder in (0, 1):
        return 0

    return 11 - remainder


def is_valid(value: str) -> bool:
    """Return True if value is a structurally and check-digit valid CNPJ.

    Numeric or alphanumeric. Accepts raw or formatted input but rejects
    unexpected characters.
    """
    if not _ALLOWED_CHARS.match(value):
        return False

    cnpj = normalize(value)

    if not _NORMALIZED_SHAPE.match(cnpj):
        return False

    first_digit = _calculate_check_digit(cnpj[:12])
    if first_digit != int(cnpj[12]):
        return False

    second_digit = _calculate_check_digit(cnpj[:13])

    return second_digit == int(cnpj[13])


def format(value: str) -> str:
    """Return value as XX.XXX.XXX/XXXX-XX.

    If the normalized value has an invalid length, value is returned
    unchanged.
    """
    cnpj = normalize(value)

    if len(cnpj) != 14:
        return value

    return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:14]}"
