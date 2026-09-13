"""PA: verified against the official SEFAZ-PA "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_PA.html), including
its two worked examples (15999999-5, 75000002-3). Format: 8 digits (always
starting with 15, 75, 76, 77, 78 or 79) + 1 check digit.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d\-\s]+$")
_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]
_VALID_PREFIXES = {"15", "75", "76", "77", "78", "79"}


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 9 or v[:2] not in _VALID_PREFIXES:
        return False

    return mod11_check_digit(weighted_sum(v, _WEIGHTS)) == int(v[8])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 9:
        return value

    return f"{v[:8]}-{v[8:9]}"
