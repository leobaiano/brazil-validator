import { removeNonDigits } from "../shared/normalize.js";
import { VALID_DDDS } from "../shared/ddd.js";
import { CPF } from "../cpf/index.js";
import { CNPJ } from "../cnpj/index.js";
import { Email } from "../email/index.js";
import { Phone } from "../phone/index.js";

export type PixKeyType = "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP";

// Formats verified against Bacen's official DICT schema
// (github.com/bacen/pix-dict-api openapi.yaml) and the Manual de Padrões
// para Iniciação do Pix:
// - CPF/CNPJ keys are digits-only (^[0-9]{11}$ / ^[0-9]{14}$). The DICT
//   schema does not yet accept alphanumeric CNPJ as a key.
// - The EVP (random key) is a canonical, case-insensitive UUID (8-4-4-4-12).
// - Phone keys use the international format "+55AANNNNNNNNN", where AA is
//   the DDD and NNNNNNNNN is a 9-digit mobile number — Brazilian Pix only
//   registers Brazilian mobile numbers, so the country code is fixed at 55.
// - Email keys are case-insensitive and capped at 77 characters.
const EVP_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_EMAIL_KEY_LENGTH = 77;

function getKeyType(value: string): PixKeyType | null {
  const trimmed = value.trim();

  if (EVP_REGEX.test(trimmed)) {
    return "EVP";
  }

  if (trimmed.includes("@")) {
    return "EMAIL";
  }

  if (trimmed.startsWith("+")) {
    return "PHONE";
  }

  if (/^\d{11}$/.test(trimmed)) {
    return "CPF";
  }

  if (/^\d{14}$/.test(trimmed)) {
    return "CNPJ";
  }

  return null;
}

function normalizePhoneKey(value: string): string {
  return `+${removeNonDigits(value)}`;
}

function isValidPhoneKey(value: string): boolean {
  if (!/^[\d\s()+-]+$/.test(value)) {
    return false;
  }

  const phone = normalizePhoneKey(value);

  if (!/^\+55\d{11}$/.test(phone)) {
    return false;
  }

  const ddd = phone.slice(3, 5);
  const subscriberFirstDigit = phone[5];

  return VALID_DDDS.has(ddd) && subscriberFirstDigit === "9";
}

function formatPhoneKey(value: string): string {
  const phone = normalizePhoneKey(value);

  if (!/^\+55\d{11}$/.test(phone)) {
    return value;
  }

  return `+55 ${Phone.format(phone.slice(3))}`;
}

function isValid(value: string): boolean {
  const type = getKeyType(value);

  if (!type) {
    return false;
  }

  const trimmed = value.trim();

  switch (type) {
    case "CPF":
      return CPF.isValid(trimmed);
    case "CNPJ":
      return CNPJ.isValid(trimmed);
    case "EMAIL":
      return trimmed.length <= MAX_EMAIL_KEY_LENGTH && Email.isValid(trimmed);
    case "PHONE":
      return isValidPhoneKey(trimmed);
    case "EVP":
      return true;
  }
}

function normalize(value: string): string {
  const type = getKeyType(value);

  if (!type) {
    return value;
  }

  const trimmed = value.trim();

  switch (type) {
    case "CPF":
      return CPF.normalize(trimmed);
    case "CNPJ":
      return CNPJ.normalize(trimmed);
    case "EMAIL":
      return Email.normalize(trimmed);
    case "PHONE":
      return normalizePhoneKey(trimmed);
    case "EVP":
      return trimmed.toLowerCase();
  }
}

function format(value: string): string {
  const type = getKeyType(value);

  if (!type) {
    return value;
  }

  const trimmed = value.trim();

  switch (type) {
    case "CPF":
      return CPF.format(trimmed);
    case "CNPJ":
      return CNPJ.format(trimmed);
    case "EMAIL":
      return Email.format(trimmed);
    case "PHONE":
      return formatPhoneKey(trimmed);
    case "EVP":
      return trimmed.toLowerCase();
  }
}

export const PIX = {
  getKeyType,
  isValid,
  normalize,
  format,
};
