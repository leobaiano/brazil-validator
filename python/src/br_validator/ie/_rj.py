"""RJ: verified against the official SEFAZ-RJ "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RJ.html) for the
check-digit rule, and cross-checked against a worked example (99.999.99-3)
for the weights, which the Sintegra page itself does not enumerate.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d.\-\s]+$")
_WEIGHTS = [2, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def _calculate_check_digit(v: str) -> int:
    total = weighted_sum(v, _WEIGHTS)
    remainder = total % 11

    if remainder <= 1:
        return 0

    return 11 - remainder


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 8:
        return False

    return _calculate_check_digit(v) == int(v[7])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 8:
        return value

    return f"{v[:2]}.{v[2:5]}.{v[5:7]}-{v[7:8]}"
