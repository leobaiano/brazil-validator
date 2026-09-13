"""DF: SEFAZ-DF's own Sintegra "Roteiro de Crítica" page
(sintegra.gov.br/Cad_Estados/cad_DF.html) is empty, so this was instead
cross-verified against two independent secondary sources that agree with
each other (cadcobol.com.br's fully worked example, arithmetic re-checked
by hand, and mestredocalculo.com.br independently citing the same valid
example "07.300.001.001-09"). The algorithm is structurally identical to
AC's officially-confirmed one (same weight sequences), differing only in
the fixed "07" prefix -- strong evidence both derive from the same
original SEFAZ documentation.

Format: "07" (fixed) + 6 sequence digits + 3 "ordem do estabelecimento"
digits (001 = matriz) + 2 check digits = 13 digits total.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d./\-\s]+$")
_FIRST_DIGIT_WEIGHTS = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
_SECOND_DIGIT_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]


def normalize(value: str) -> str:
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) != 13 or not v.startswith("07"):
        return False

    first_digit = mod11_check_digit(weighted_sum(v, _FIRST_DIGIT_WEIGHTS))
    if first_digit != int(v[11]):
        return False

    second_digit = mod11_check_digit(weighted_sum(v, _SECOND_DIGIT_WEIGHTS))

    return second_digit == int(v[12])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) != 13:
        return value

    return f"{v[:2]}.{v[2:5]}.{v[5:8]}.{v[8:11]}-{v[11:13]}"
