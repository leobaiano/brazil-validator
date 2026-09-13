"""PE: verified against the official SEFAZ-PE "Roteiro de Crítica da
Inscrição Estadual" for the e-Fisco system
(sintegra.gov.br/Cad_Estados/cad_PE.html), including its fully worked
example (0321418-40). Format: 7 digits + 2 check digits.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d\-\s]+$")
_FIRST_DIGIT_WEIGHTS = [8, 7, 6, 5, 4, 3, 2]
_SECOND_DIGIT_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 9:
        return False

    base = v[:7]
    first_digit = mod11_check_digit(weighted_sum(base, _FIRST_DIGIT_WEIGHTS))

    if first_digit != int(v[7]):
        return False

    second_digit = mod11_check_digit(weighted_sum(base + str(first_digit), _SECOND_DIGIT_WEIGHTS))

    return second_digit == int(v[8])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 9:
        return value

    return f"{v[:7]}-{v[7:9]}"
