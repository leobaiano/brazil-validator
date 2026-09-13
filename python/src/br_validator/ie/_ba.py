"""BA: verified against the official SEFAZ-BA "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_BA.html), including
its four worked examples (123456-63, 612345-57, 1000003-06 mod-10/mod-11 x
8/9-digit variants).

Bahia has two lengths (8 or 9 digits) and, within each, two moduli: módulo
10 when the discriminating digit (the 1st digit for 8-digit IEs, the 2nd
for 9-digit IEs) is one of 0,1,2,3,4,5,8, and módulo 11 when it is 6, 7 or
9. The last check digit is calculated first (from the base digits alone),
then the first check digit is calculated from the base plus that digit.
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod10_check_digit, mod11_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d\-\s]+$")
_MOD10_DIGITS = set("0123458")
_MOD11_DIGITS = set("679")


def normalize(value: str) -> str:
    return remove_non_digits(value)


def _check_digit_for(total: int, use_mod11: bool) -> int:
    return mod11_check_digit(total) if use_mod11 else mod10_check_digit(total)


def _descending_weights(length: int) -> list:
    return [length + 1 - i for i in range(length)]


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) not in (8, 9):
        return False

    discriminant = v[0] if len(v) == 8 else v[1]
    use_mod11 = discriminant in _MOD11_DIGITS

    if not use_mod11 and discriminant not in _MOD10_DIGITS:
        return False

    base_length = len(v) - 2
    base = v[:base_length]
    last_digit = _check_digit_for(weighted_sum(base, _descending_weights(base_length)), use_mod11)

    if last_digit != int(v[-1]):
        return False

    base_with_last_digit = base + str(last_digit)
    first_digit = _check_digit_for(
        weighted_sum(base_with_last_digit, _descending_weights(base_length + 1)), use_mod11
    )

    return first_digit == int(v[-2])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) not in (8, 9):
        return value

    return f"{v[:-2]}-{v[-2:]}"
