"""Validates, normalizes, and formats PIX keys.

A PIX key can be a CPF, CNPJ, e-mail, phone, or random key.
"""

import re
from enum import Enum
from typing import Optional

from . import cnpj as _cnpj
from . import cpf as _cpf
from . import email as _email
from . import phone as _phone
from ._shared import VALID_DDDS, remove_non_digits


class KeyType(str, Enum):
    """Identifies which kind of PIX key a value looks like."""

    CPF = "CPF"
    CNPJ = "CNPJ"
    EMAIL = "EMAIL"
    PHONE = "PHONE"
    EVP = "EVP"


# Formats verified against Bacen's official DICT schema
# (github.com/bacen/pix-dict-api openapi.yaml) and the Manual de Padrões
# para Iniciação do Pix:
# - CPF/CNPJ keys are digits-only (^[0-9]{11}$ / ^[0-9]{14}$). The DICT
#   schema does not yet accept alphanumeric CNPJ as a key.
# - The EVP (random key) is a canonical, case-insensitive UUID (8-4-4-4-12).
# - Phone keys use the international format "+55AANNNNNNNNN", where AA is
#   the DDD and NNNNNNNNN is a 9-digit mobile number -- Brazilian Pix only
#   registers Brazilian mobile numbers, so the country code is fixed at 55.
# - Email keys are case-insensitive and capped at 77 characters.
_EVP_REGEX = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.IGNORECASE
)
_CPF_SHAPE = re.compile(r"^\d{11}$")
_CNPJ_SHAPE = re.compile(r"^\d{14}$")
_PHONE_CHARS = re.compile(r"^[\d\s()+-]+$")
_PHONE_KEY_FORM = re.compile(r"^\+55\d{11}$")

_MAX_EMAIL_KEY_LENGTH = 77


def get_key_type(value: str) -> Optional[KeyType]:
    """Detect which kind of PIX key value looks like, or None if it matches none."""
    trimmed = value.strip()

    if _EVP_REGEX.match(trimmed):
        return KeyType.EVP

    if "@" in trimmed:
        return KeyType.EMAIL

    if trimmed.startswith("+"):
        return KeyType.PHONE

    if _CPF_SHAPE.match(trimmed):
        return KeyType.CPF

    if _CNPJ_SHAPE.match(trimmed):
        return KeyType.CNPJ

    return None


def _normalize_phone_key(value: str) -> str:
    return f"+{remove_non_digits(value)}"


def _is_valid_phone_key(value: str) -> bool:
    if not _PHONE_CHARS.match(value):
        return False

    phone = _normalize_phone_key(value)

    if not _PHONE_KEY_FORM.match(phone):
        return False

    ddd = phone[3:5]
    subscriber_first_digit = phone[5]

    return ddd in VALID_DDDS and subscriber_first_digit == "9"


def _format_phone_key(value: str) -> str:
    phone = _normalize_phone_key(value)

    if not _PHONE_KEY_FORM.match(phone):
        return value

    return f"+55 {_phone.format(phone[3:])}"


def is_valid(value: str) -> bool:
    """Return True if value is a valid PIX key of any recognized type."""
    key_type = get_key_type(value)

    if key_type is None:
        return False

    trimmed = value.strip()

    if key_type is KeyType.CPF:
        return _cpf.is_valid(trimmed)
    if key_type is KeyType.CNPJ:
        return _cnpj.is_valid(trimmed)
    if key_type is KeyType.EMAIL:
        return len(trimmed) <= _MAX_EMAIL_KEY_LENGTH and _email.is_valid(trimmed)
    if key_type is KeyType.PHONE:
        return _is_valid_phone_key(trimmed)

    return True  # EVP: shape already fully validated by the regex.


def normalize(value: str) -> str:
    """Dispatch to the canonical normalize rule of value's detected key type.

    If the type cannot be detected, value is returned unchanged.
    """
    key_type = get_key_type(value)

    if key_type is None:
        return value

    trimmed = value.strip()

    if key_type is KeyType.CPF:
        return _cpf.normalize(trimmed)
    if key_type is KeyType.CNPJ:
        return _cnpj.normalize(trimmed)
    if key_type is KeyType.EMAIL:
        return _email.normalize(trimmed)
    if key_type is KeyType.PHONE:
        return _normalize_phone_key(trimmed)

    return trimmed.lower()  # EVP


def format(value: str) -> str:
    """Dispatch to the canonical format rule of value's detected key type.

    If the type cannot be detected, value is returned unchanged.
    """
    key_type = get_key_type(value)

    if key_type is None:
        return value

    trimmed = value.strip()

    if key_type is KeyType.CPF:
        return _cpf.format(trimmed)
    if key_type is KeyType.CNPJ:
        return _cnpj.format(trimmed)
    if key_type is KeyType.EMAIL:
        return _email.format(trimmed)
    if key_type is KeyType.PHONE:
        return _format_phone_key(trimmed)

    return trimmed.lower()  # EVP
