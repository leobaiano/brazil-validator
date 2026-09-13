import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-PR "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_PR.html), including its fully
// worked example (123.45678-50), and cross-checked against the reference
// Visual Basic routine published on the same page. Format: 8 digits + 2
// check digits.
const FIRST_DIGIT_WEIGHTS = [3, 2, 7, 6, 5, 4, 3, 2];
const SECOND_DIGIT_WEIGHTS = [4, 3, 2, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 10) {
    return false;
  }

  const base = ie.slice(0, 8);
  const firstDigit = mod11CheckDigit(weightedSum(base, FIRST_DIGIT_WEIGHTS));

  if (firstDigit !== Number(ie[8])) {
    return false;
  }

  const secondDigit = mod11CheckDigit(weightedSum(base + firstDigit, SECOND_DIGIT_WEIGHTS));

  return secondDigit === Number(ie[9]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 10) {
    return value;
  }

  return ie.replace(/^(\d{3})(\d{5})(\d{2})$/, "$1.$2-$3");
}

export const PR = {
  isValid,
  normalize,
  format,
};
