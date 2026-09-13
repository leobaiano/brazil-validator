"""AL: verified against the official SEFAZ-AL "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AL.html), including
its worked example (24000004 -> check digit 8, i.e. 240000048).

Format: "24" (fixed) + 1 "tipo de empresa" digit (0,3,5,7,8) + 5 sequence
digits + 1 check digit = 9 digits total. No official punctuation mask is
published, so format() returns the plain digits.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_times_ten_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d\s]+$")
_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]
_VALID_TYPE_DIGITS = {"0", "3", "5", "7", "8"}


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 9 or not v.startswith("24"):
        return False

    if v[2] not in _VALID_TYPE_DIGITS:
        return False

    check_digit = mod11_times_ten_check_digit(weighted_sum(v, _WEIGHTS))

    return check_digit == int(v[8])


def format(value: str) -> str:
    return normalize(value)
