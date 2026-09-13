import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum } from "../../shared/mod11.js";

// Verified against the official SEFAZ-RR "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RR.html), including its worked
// example (24006153-6) and the ten additional valid numbers it lists.
// Format: "24" (fixed) + 6 sequence digits + 1 check digit = 9 digits total.
// Unlike every other state, the check digit uses módulo 9, and the weights
// are the digit's own 1-based position (ascending, not descending).
const WEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9 || !ie.startsWith("24")) {
    return false;
  }

  const checkDigit = weightedSum(ie, WEIGHTS) % 9;

  return checkDigit === Number(ie[8]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 9) {
    return value;
  }

  return ie.replace(/^(\d{8})(\d)$/, "$1-$2");
}

export const RR = {
  isValid,
  normalize,
  format,
};
