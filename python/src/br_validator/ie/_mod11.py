"""Shared by most Inscrição Estadual algorithms (SEFAZ "Roteiro de Crítica"
documents): weight each digit, sum the products, then reduce modulo 11.
"""


def weighted_sum(digits: str, weights: list) -> int:
    total = 0

    for i, weight in enumerate(weights):
        total += int(digits[i]) * weight

    return total


def mod11_check_digit(total: int) -> int:
    """The most common check-digit rule across states.

    Remainder 0 or 1 maps to digit 0, otherwise the digit is 11 minus the
    remainder.
    """
    remainder = total % 11

    if remainder <= 1:
        return 0

    return 11 - remainder


def mod10_check_digit(total: int) -> int:
    """Used by Bahia's módulo-10 branch.

    Remainder 0 maps to digit 0, otherwise the digit is 10 minus the
    remainder.
    """
    remainder = total % 10

    if remainder == 0:
        return 0

    return 10 - remainder


def mod11_times_ten_check_digit(total: int) -> int:
    """Used by Alagoas and Rio Grande do Norte.

    The sum is multiplied by 10 before reducing modulo 11, and the
    remainder *is* the digit directly (a remainder of 10 wraps to 0).
    Mirrors CPF's check-digit formula.
    """
    remainder = (total * 10) % 11

    if remainder == 10:
        return 0

    return remainder
