"""Validates, normalizes, and formats Brazilian CEP (postal) codes."""

import re

from ._shared import remove_non_digits

_ALLOWED_CHARS = re.compile(r"^[\d-]+$")


def normalize(value: str) -> str:
    """Strip formatting and return the canonical (digits-only) form of value."""
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    """Return True if value is a structurally valid CEP.

    A CEP has no check digit -- it is an 8-digit postal routing code
    (region, sub-region, sector, subsector and distribution suffix)
    defined by Correios -- so validity here means structural correctness
    (8 digits), not whether the code exists in Correios' address database.
    """
    if not _ALLOWED_CHARS.match(value):
        return False

    return len(normalize(value)) == 8


def format(value: str) -> str:
    """Return value as XXXXX-XXX.

    If the normalized value has an invalid length, value is returned
    unchanged.
    """
    cep = normalize(value)

    if len(cep) != 8:
        return value

    return f"{cep[:5]}-{cep[5:8]}"
