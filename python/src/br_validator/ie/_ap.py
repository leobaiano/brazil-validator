"""AP: verified against the official SEFAZ-AP "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AP.html), including
its worked example (030123459).

Format: "03" (fixed) + 6 sequence digits + 1 check digit = 9 digits total.
Unlike other states, the weighted sum starts from a constant "p" that
depends on the numeric range of the registration, and a zero remainder
maps to a range-dependent digit "d" instead of always 0.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d\s]+$")
_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def _resolve_constants(base: int):
    if base <= 3017000:
        return 5, 0

    if base <= 3019022:
        return 9, 1

    return 0, 0


def _calculate_check_digit(v: str) -> int:
    base = v[:8]
    p, d = _resolve_constants(int(base))
    total = p + weighted_sum(base, _WEIGHTS)
    remainder = total % 11

    if remainder == 1:
        return 0

    if remainder == 0:
        return d

    return 11 - remainder


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 9 or not v.startswith("03"):
        return False

    return _calculate_check_digit(v) == int(v[8])


def format(value: str) -> str:
    return normalize(value)
