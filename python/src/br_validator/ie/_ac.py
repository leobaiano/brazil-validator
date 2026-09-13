"""AC: verified against the official SEFAZ-AC "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AC.html), including
its worked example (01.004.823/001-12). Format: 11 digits (always starting
with "01") + 2 check digits.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d./\-\s]+$")
_FIRST_DIGIT_WEIGHTS = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
_SECOND_DIGIT_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 13 or not v.startswith("01"):
        return False

    first_digit = mod11_check_digit(weighted_sum(v, _FIRST_DIGIT_WEIGHTS))
    if first_digit != int(v[11]):
        return False

    second_digit = mod11_check_digit(weighted_sum(v, _SECOND_DIGIT_WEIGHTS))

    return second_digit == int(v[12])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 13:
        return value

    return f"{v[:2]}.{v[2:5]}.{v[5:8]}/{v[8:11]}-{v[11:13]}"
