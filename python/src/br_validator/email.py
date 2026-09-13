"""Validates, normalizes, and formats e-mail addresses."""

import re

# Sourced from the WHATWG HTML Living Standard's email state regex (used by
# browsers to validate <input type="email">). All quantifiers are bounded,
# so it cannot suffer catastrophic backtracking.
_EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"
    r"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
)

_MAX_EMAIL_LENGTH = 254
_MAX_LOCAL_PART_LENGTH = 64


def normalize(value: str) -> str:
    """Trim whitespace and lowercase value."""
    return value.strip().lower()


def is_valid(value: str) -> bool:
    """Return True if value is a structurally valid e-mail address.

    Per the WHATWG regular expression plus RFC 5321 length limits.
    """
    email = normalize(value)

    if len(email) == 0 or len(email) > _MAX_EMAIL_LENGTH:
        return False

    local_part = email.split("@", 1)[0]

    if not local_part or len(local_part) > _MAX_LOCAL_PART_LENGTH:
        return False

    return bool(_EMAIL_REGEX.match(email))


def format(value: str) -> str:
    """Return the same canonical value as normalize().

    Unlike CPF/CNPJ/CEP/Phone, an e-mail address has no visual mask to
    apply.
    """
    return normalize(value)
