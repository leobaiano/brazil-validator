"""PR: verified against the official SEFAZ-PR "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_PR.html), including
its fully worked example (123.45678-50), and cross-checked against the
reference Visual Basic routine published on the same page. Format: 8
digits + 2 check digits.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d.\-\s]+$")
_FIRST_DIGIT_WEIGHTS = [3, 2, 7, 6, 5, 4, 3, 2]
_SECOND_DIGIT_WEIGHTS = [4, 3, 2, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 10:
        return False

    base = v[:8]
    first_digit = mod11_check_digit(weighted_sum(base, _FIRST_DIGIT_WEIGHTS))

    if first_digit != int(v[8]):
        return False

    second_digit = mod11_check_digit(weighted_sum(base + str(first_digit), _SECOND_DIGIT_WEIGHTS))

    return second_digit == int(v[9])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 10:
        return value

    return f"{v[:3]}.{v[3:8]}-{v[8:10]}"
