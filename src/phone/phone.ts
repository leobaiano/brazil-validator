import { removeNonDigits } from "../shared/normalize.js";

// Anatel's Plano de Numeração Brasileiro defines exactly 67 valid DDD (area)
// codes, not every two-digit value from 11-99.
const VALID_DDDS = new Set([
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "21", "22", "24",
  "27", "28",
  "31", "32", "33", "34", "35", "37", "38",
  "41", "42", "43", "44", "45", "46", "47", "48", "49",
  "51", "53", "54", "55",
  "61", "62", "63", "64", "65", "66", "67", "68", "69",
  "71", "73", "74", "75", "77", "79",
  "81", "82", "83", "84", "85", "86", "87", "88", "89",
  "91", "92", "93", "94", "95", "96", "97", "98", "99",
]);

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
