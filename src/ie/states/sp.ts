import { removeNonDigits } from "../../shared/normalize.js";

// Verified against the official SEFAZ-SP "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_SP.html), including its worked
// example (110.042.490.114). Only the standard industrial/commercial format
// (12 digits) is covered; the "Produtor Rural" format ("P" + 12 chars) is a
// distinct layout and is not yet supported.
const FIRST_DIGIT_WEIGHTS = [1, 3, 4, 5, 6, 7, 8, 10];
const SECOND_DIGIT_WEIGHTS = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function calculateCheckDigit(digits: string, weights: number[]): number {
  let sum = 0;

  for (let i = 0; i < weights.length; i++) {
    sum += Number(digits[i]) * weights[i]!;
  }

  return sum % 11 === 10 ? 0 : sum % 11;
}

function isValid(value: string): boolean {
  if (!/^[\d.\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 12) {
    return false;
  }

  const firstDigit = calculateCheckDigit(ie, FIRST_DIGIT_WEIGHTS);

  if (firstDigit !== Number(ie[8])) {
    return false;
  }

  const secondDigit = calculateCheckDigit(ie, SECOND_DIGIT_WEIGHTS);

  return secondDigit === Number(ie[11]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 12) {
    return value;
  }

  return ie.replace(/^(\d{3})(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3.$4");
}

export const SP = {
  isValid,
  normalize,
  format,
};
