import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-AM "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_AM.html). Format: 99.999.999-9
// (8 digits + 1 check digit). Unlike most other states, when the weighted
// sum itself is below 11 the digit is 11 minus the sum directly (skipping
// the modulo step).
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function calculateCheckDigit(ie: string): number {
  const sum = weightedSum(ie, WEIGHTS);

  if (sum < 11) {
    return 11 - sum;
  }

  return mod11CheckDigit(sum);
}

function isValid(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9) {
    return false;
  }

  return calculateCheckDigit(ie) === Number(ie[8]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 9) {
    return value;
  }

  return ie.replace(/^(\d{2})(\d{3})(\d{3})(\d)$/, "$1.$2.$3-$4");
}

export const AM = {
  isValid,
  normalize,
  format,
};
