"""Validates, normalizes, and formats Brazilian national phone numbers.

Mobile and landline, no +55 country code.
"""

import re

from ._shared import VALID_DDDS, remove_non_digits

_ALLOWED_CHARS = re.compile(r"^[\d\s()-]+$")


def normalize(value: str) -> str:
    """Strip formatting and return the canonical (digits-only) form of value."""
    return remove_non_digits(value)


def is_valid(value: str) -> bool:
    """Return True if value is a structurally valid Brazilian phone number.

    Enforces Anatel's numbering plan: the DDD must be one of the 67 codes
    actually assigned, mobile numbers (11 digits) must carry the "ninth
    digit" 9 (Resolução nº 553/2010), and landline numbers (10 digits) must
    start with 2-5.
    """
    if not _ALLOWED_CHARS.match(value):
        return False

    phone = normalize(value)

    if len(phone) not in (10, 11):
        return False

    if phone[:2] not in VALID_DDDS:
        return False

    subscriber_first_digit = phone[2]

    if len(phone) == 11:
        return subscriber_first_digit == "9"

    return subscriber_first_digit in "2345"


def format(value: str) -> str:
    """Return value as (XX) XXXXX-XXXX (mobile) or (XX) XXXX-XXXX (landline).

    If the normalized value has an invalid length, value is returned
    unchanged.
    """
    phone = normalize(value)

    if len(phone) == 11:
        return f"({phone[:2]}) {phone[2:7]}-{phone[7:11]}"

    if len(phone) == 10:
        return f"({phone[:2]}) {phone[2:6]}-{phone[6:10]}"

    return value
