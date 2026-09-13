"""SP: verified against the official SEFAZ-SP "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_SP.html), including
both of its worked examples: the standard industrial/commercial format
(110.042.490.114) and the "Produtor Rural" format (P-01100424.3/002).

Note: the source restates the Produtor Rural example at the very end as
"P-011000424.3/002" (14 characters) -- this contradicts both the
document's own "13 caracteres" rule and its worked calculation (which sums
exactly 8 digits to 91, matching the 13-character form). Treated as a typo
in the source; the 13-character form is what this module expects.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import weighted_sum

_STANDARD_ALLOWED_CHARS = re.compile(r"^[\d.\s]+$")
_PRODUTOR_RURAL_ALLOWED = re.compile(r"^[Pp\d.\-/\s]+$")
_FORMATTING_CHARS = re.compile(r"[.\-/\s]")
_PRODUTOR_RURAL_PREFIX = re.compile(r"^\s*[Pp]")

_STANDARD_FIRST_DIGIT_WEIGHTS = [1, 3, 4, 5, 6, 7, 8, 10]
_STANDARD_SECOND_DIGIT_WEIGHTS = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2]
_PRODUTOR_RURAL_WEIGHTS = [1, 3, 4, 5, 6, 7, 8, 10]


def _calculate_check_digit(digits: str, weights: list) -> int:
    total = weighted_sum(digits, weights)

    if total % 11 == 10:
        return 0

    return total % 11


def _is_produtor_rural(value: str) -> bool:
    return bool(_PRODUTOR_RURAL_PREFIX.match(value))


def _normalize_standard(value: str) -> str:
    return remove_non_digits(value)


def _is_valid_standard(value: str) -> bool:
    if not _STANDARD_ALLOWED_CHARS.match(value):
        return False

    v = _normalize_standard(value)

    if len(v) != 12:
        return False

    first_digit = _calculate_check_digit(v, _STANDARD_FIRST_DIGIT_WEIGHTS)
    if first_digit != int(v[8]):
        return False

    second_digit = _calculate_check_digit(v, _STANDARD_SECOND_DIGIT_WEIGHTS)

    return second_digit == int(v[11])


def _format_standard(value: str) -> str:
    v = _normalize_standard(value)

    if len(v) != 12:
        return value

    return f"{v[:3]}.{v[3:6]}.{v[6:9]}.{v[9:12]}"


def _normalize_produtor_rural(value: str) -> str:
    """Format: P0MMMSSSSD000 (13 characters) -- "P" (fixed) + "0" (fixed)
    + 3 município digits + 4 sequence digits + 1 check digit + 3 unused
    digits.
    """
    return _FORMATTING_CHARS.sub("", value).upper()


def _is_valid_produtor_rural(value: str) -> bool:
    if not _PRODUTOR_RURAL_ALLOWED.match(value):
        return False

    v = _normalize_produtor_rural(value)

    if len(v) != 13 or v[0] != "P" or v[1] != "0":
        return False

    base = v[1:9]
    check_digit = _calculate_check_digit(base, _PRODUTOR_RURAL_WEIGHTS)

    return check_digit == int(v[9])


def _format_produtor_rural(value: str) -> str:
    v = _normalize_produtor_rural(value)

    if len(v) != 13:
        return value

    return f"P-{v[1:9]}.{v[9:10]}/{v[10:13]}"


def is_valid(value: str) -> bool:
    if _is_produtor_rural(value):
        return _is_valid_produtor_rural(value)

    return _is_valid_standard(value)


def normalize(value: str) -> str:
    if _is_produtor_rural(value):
        return _normalize_produtor_rural(value)

    return _normalize_standard(value)


def format(value: str) -> str:
    if _is_produtor_rural(value):
        return _format_produtor_rural(value)

    return _format_standard(value)
