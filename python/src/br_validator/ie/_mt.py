"""MT: verified against the official SEFAZ-MT "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_MT.html), including
its worked example (0013000001-9). Format: 10 digits + 1 check digit.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d\-\s]+$")
_WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 11:
        return False

    return mod11_check_digit(weighted_sum(v, _WEIGHTS)) == int(v[10])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 11:
        return value

    return f"{v[:10]}-{v[10:11]}"
