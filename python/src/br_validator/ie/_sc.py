"""SC: verified against the official SEFAZ-SC "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_SC.html), including
its worked example (251.040.852). Format: 8 digits + 1 check digit.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d.\s]+$")
_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 9:
        return False

    return mod11_check_digit(weighted_sum(v, _WEIGHTS)) == int(v[8])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 9:
        return value

    return f"{v[:3]}.{v[3:6]}.{v[6:9]}"
