"""TO: verified against the official SEFAZ-TO "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_TO.html), including
its worked example (29010227836). Format: 11 digits, where positions 3-4
hold a fixed "tipo" code (01 Produtor Rural, 02 Indústria e Comércio, 03
Empresas Rudimentares, 99 Cadastro Antigo) that is excluded from the
check-digit calculation, and position 11 is the check digit.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit

_ALLOWED_CHARS = re.compile(r"^[\d\s]+$")
_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]
_VALID_TYPE_CODES = {"01", "02", "03", "99"}
# 1-based positions used in the check-digit calculation (positions 3-4 are
# skipped).
_DIGIT_POSITIONS = [1, 2, 5, 6, 7, 8, 9, 10]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 11 or v[2:4] not in _VALID_TYPE_CODES:
        return False

    total = 0
    for i, pos in enumerate(_DIGIT_POSITIONS):
        total += int(v[pos - 1]) * _WEIGHTS[i]

    return mod11_check_digit(total) == int(v[10])


def format(value: str) -> str:
    return normalize(value)
