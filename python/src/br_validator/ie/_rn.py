"""RN: verified against the official SEFAZ-RN "Roteiro de Crítica da
Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RN.html), including
both of its worked examples (20.040.040-1 and 20.0.040.040-0). Format:
always starts with "20", followed by either 7 or 8 more digits, plus 1
check digit (9 or 10 digits total, both still valid today per the official
page).
"""

import re

from .._shared import remove_non_digits
from ._mod11 import mod11_times_ten_check_digit, weighted_sum

_ALLOWED_CHARS = re.compile(r"^[\d.\-\s]+$")


def normalize(value: str) -> str:
    return remove_non_digits(value)


def _weights_for(base_length: int) -> list:
    return [base_length + 1 - i for i in range(base_length)]


def is_valid(value: str) -> bool:
    if not _ALLOWED_CHARS.match(value):
        return False

    v = normalize(value)

    if len(v) not in (9, 10) or not v.startswith("20"):
        return False

    base = v[:-1]
    check_digit = mod11_times_ten_check_digit(weighted_sum(base, _weights_for(len(base))))

    return check_digit == int(v[-1])


def format(value: str) -> str:
    v = normalize(value)

    if len(v) == 9:
        return f"{v[:2]}.{v[2:5]}.{v[5:8]}-{v[8:9]}"

    if len(v) == 10:
        return f"{v[:2]}.{v[2:3]}.{v[3:6]}.{v[6:9]}-{v[9:10]}"

    return value
