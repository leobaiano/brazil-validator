import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-MA "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_MA.html), including its worked
// example (120000385). Format: "12" (fixed) + 6 sequence digits + 1 check
// digit = 9 digits total. No official punctuation mask is published, so
// format() returns plain digits.
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9 || !ie.startsWith("12")) {
    return false;
  }

  return mod11CheckDigit(weightedSum(ie, WEIGHTS)) === Number(ie[8]);
}

function format(value: string): string {
  return normalize(value);
}

export const MA = {
  isValid,
  normalize,
  format,
};
