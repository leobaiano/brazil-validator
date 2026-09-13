import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11TimesTenCheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-AL "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_AL.html), including its worked
// example (24000004 -> check digit 8, i.e. 240000048).
// Format: "24" (fixed) + 1 "tipo de empresa" digit (0,3,5,7,8) + 5 sequence
// digits + 1 check digit = 9 digits total. No official punctuation mask is
// published, so format() returns the plain digits.
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];
const VALID_TYPE_DIGITS = new Set(["0", "3", "5", "7", "8"]);

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9 || !ie.startsWith("24")) {
    return false;
  }

  const typeDigit = ie[2];

  if (!typeDigit || !VALID_TYPE_DIGITS.has(typeDigit)) {
    return false;
  }

  const checkDigit = mod11TimesTenCheckDigit(weightedSum(ie, WEIGHTS));

  return checkDigit === Number(ie[8]);
}

function format(value: string): string {
  return normalize(value);
}

export const AL = {
  isValid,
  normalize,
  format,
};
