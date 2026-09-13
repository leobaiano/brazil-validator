"""GO: verified against the official SEFAZ-GO "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_GO.html), including
its worked example (10.987.654-7). Format: AB.CDE.FGH-I, where AB must be
10, 11, or 20-29.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d.\-\s]+$")
_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def _has_valid_prefix(v: str) -> bool:
    prefix = int(v[:2])

    return prefix in (10, 11) or 20 <= prefix <= 29


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 9 or not _has_valid_prefix(v):
        return False

    return mod11_check_digit(weighted_sum(v, _WEIGHTS)) == int(v[8])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 9:
        return value

    return f"{v[:2]}.{v[2:5]}.{v[5:8]}-{v[8:9]}"
