import { removeNonDigits } from "../shared/normalize.js";
import { VALID_DDDS } from "../shared/ddd.js";

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d\s()-]+$/.test(value)) {
    return false;
  }

  const phone = normalize(value);

  if (phone.length !== 10 && phone.length !== 11) {
    return false;
  }

  const ddd = phone.slice(0, 2);

  if (!VALID_DDDS.has(ddd)) {
    return false;
  }

  const subscriberFirstDigit = phone[2];

  // Mobile numbers (11 digits) must carry the ninth digit "9"
  // (Anatel Resolução 553/2010).
  if (phone.length === 11) {
    return subscriberFirstDigit === "9";
  }

  // Fixed-line numbers (10 digits) have subscriber numbers starting with 2-5.
  return subscriberFirstDigit !== undefined && ["2", "3", "4", "5"].includes(subscriberFirstDigit);
}

function format(value: string): string {
  const phone = normalize(value);

  if (phone.length === 11) {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  if (phone.length === 10) {
    return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  return value;
}

export const Phone = {
  isValid,
  normalize,
  format,
};
