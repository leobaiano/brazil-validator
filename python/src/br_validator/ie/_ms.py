"""MS: verified against the official SEFAZ-MS "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_MS.html) for the
algorithm (which the page does not accompany with a worked numeric
example), plus an independently hand-computed regression vector
(281234566). Format: 8 digits (always starting with "28" or "50") + 1
check digit.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d\s]+$")
_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def _has_valid_prefix(v: str) -> bool:
    return v[:2] in ("28", "50")


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 9 or not _has_valid_prefix(v):
        return False

    return mod11_check_digit(weighted_sum(v, _WEIGHTS)) == int(v[8])


def format(value: str) -> str:
    return normalize(value)
