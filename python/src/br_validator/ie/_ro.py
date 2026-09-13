"""RO: verified against the official SEFAZ-RO "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RO.html), including
its worked example (0000000062521-3). Since 01/08/2000 the format is 13
digits + 1 check digit (the old "município + empresa" layout is
superseded, with old registrations re-expressed by zero-padding into the
new 13-digit field).

The weights cycle 2-9 applied right to left over the 13 digits, i.e.
[6,5,4,3,2,9,8,7,6,5,4,3,2] read left to right. Unlike most other states, a
zero remainder maps to check digit 1, not 0 (the source explicitly says
"subtract 10" from the 11-or-10 result, rather than mapping straight to
0).
"""

import re

from .._shared import remove_non_digits
from ._mod11 import weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d.\-\s]+$")
_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def _calculate_check_digit(base: str) -> int:
    remainder = weighted_sum(base, _WEIGHTS) % 11
    diff = 11 - remainder

    if diff > 9:
        return diff - 10

    return diff


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 14:
        return False

    return _calculate_check_digit(v[:13]) == int(v[13])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 14:
        return value

    return f"{v[:13]}-{v[13:14]}"
