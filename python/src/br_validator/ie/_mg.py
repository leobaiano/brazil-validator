"""MG: verified against the official SEFAZ-MG "Roteiro de Crítica da
Inscrição Estadual" (mirrored at sintegra.gov.br/Cad_Estados/cad_MG.html),
including its fully worked example (062.307.904/0081).

Format: A1A2A3 B1B2B3B4B5B6 C1C2 D1D2 (13 digits), where A = município
code, B = registration number, C = establishment order, D = check digits.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d./\s]+$")
_FIRST_DIGIT_WEIGHTS = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
_SECOND_DIGIT_WEIGHTS = [3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def _sum_of_digits(value: int) -> int:
    return sum(int(c) for c in str(value))


def _calculate_first_digit(base: str) -> int:
    """Equalize the field widths by inserting a "0" right after the
    município code, then sum the *digits* of each weighted product (not
    the products themselves) before completing to the next multiple of
    ten.
    """
    with_inserted_zero = base[:3] + "0" + base[3:]

    digit_sum = 0
    for i, weight in enumerate(_FIRST_DIGIT_WEIGHTS):
        digit_sum += _sum_of_digits(int(with_inserted_zero[i]) * weight)

    remainder = digit_sum % 10

    if remainder == 0:
        return 0

    return 10 - remainder


def _calculate_second_digit(base: str, first_digit: int) -> int:
    """Use the original (un-padded) base plus D1, and sum the weighted
    products directly, following the general módulo 11 remainder rule.
    """
    with_first_digit = base + str(first_digit)

    total = weighted_sum(with_first_digit, _SECOND_DIGIT_WEIGHTS)
    remainder = total % 11

    if remainder <= 1:
        return 0

    return 11 - remainder


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 13:
        return False

    base = v[:11]
    first_digit = _calculate_first_digit(base)

    if first_digit != int(v[11]):
        return False

    second_digit = _calculate_second_digit(base, first_digit)

    return second_digit == int(v[12])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 13:
        return value

    return f"{v[:3]}.{v[3:6]}.{v[6:9]}/{v[9:13]}"
