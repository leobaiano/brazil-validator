"""RS: verified against the official SEFAZ-RS "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RS.html), including
its worked example (224/3658792). Format: 3 digits (município) + 6 digits
(empresa) + 1 check digit = 10 digits total.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d/\s]+$")
_WEIGHTS = [2, 9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 10:
        return False

    return mod11_check_digit(weighted_sum(v, _WEIGHTS)) == int(v[9])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 10:
        return value

    return f"{v[:3]}/{v[3:10]}"
