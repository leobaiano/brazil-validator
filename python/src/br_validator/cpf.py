"""Validates, normalizes, and formats Brazilian CPF numbers."""

import re

from ._shared import remove_non_digits

_ALLOWED_CHARS = re.compile(r"^[\d.\-\s]+$")
_REPEATED_DIGITS = re.compile(r"^(\d)\1{10}$")


def normalize(value: str) -> str:
    """Strip formatting and return the canonical (digits-only) form of value."""
    return remove_non_digits(value)


def _calculate_check_digit(cpf: str, weight: int) -> int:
    total = 0

    for i, char in enumerate(cpf):
        total += int(char) * (weight - i)

    remainder = (total * 10) % 11

    if remainder == 10:
        remainder = 0

    return remainder


def is_valid(value: str) -> bool:
    """Return True if value is a structurally and check-digit valid CPF.

    Accepts raw or formatted input but rejects unexpected characters.
    """
    if not _ALLOWED_CHARS.match(value):
        return False

    cpf = normalize(value)

    if len(cpf) != 11:
        return False

    if _REPEATED_DIGITS.match(cpf):
        return False

    first_digit = _calculate_check_digit(cpf[:9], 10)
    if first_digit != int(cpf[9]):
        return False

    second_digit = _calculate_check_digit(cpf[:10], 11)

    return second_digit == int(cpf[10])


def format(value: str) -> str:
    """Return value as XXX.XXX.XXX-XX.

    If the normalized value has an invalid length, value is returned
    unchanged.
    """
    cpf = normalize(value)

    if len(cpf) != 11:
        return value

    return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:11]}"
