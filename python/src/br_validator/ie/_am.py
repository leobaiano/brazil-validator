"""AM: verified against the official SEFAZ-AM "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AM.html). Format:
99.999.999-9 (8 digits + 1 check digit). Unlike most other states, when the
weighted sum itself is below 11 the digit is 11 minus the sum directly
(skipping the modulo step).
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d.\-\s]+$")
_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def _calculate_check_digit(v: str) -> int:
    total = weighted_sum(v, _WEIGHTS)

    if total < 11:
        return 11 - total

    return mod11_check_digit(total)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 9:
        return False

    return _calculate_check_digit(v) == int(v[8])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 9:
        return value

    return f"{v[:2]}.{v[2:5]}.{v[5:8]}-{v[8:9]}"
