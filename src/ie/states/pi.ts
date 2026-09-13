import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-PI "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_PI.html), including its worked
// example (012345679). Format: 8 digits + 1 check digit.
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9) {
    return false;
  }

  return mod11CheckDigit(weightedSum(ie, WEIGHTS)) === Number(ie[8]);
}

function format(value: string): string {
  return normalize(value);
}

export const PI = {
  isValid,
  normalize,
  format,
};
