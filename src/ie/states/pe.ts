import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-PE "Roteiro de Crítica da Inscrição
// Estadual" for the e-Fisco system (sintegra.gov.br/Cad_Estados/cad_PE.html),
// including its fully worked example (0321418-40). Format: 7 digits + 2
// check digits.
const FIRST_DIGIT_WEIGHTS = [8, 7, 6, 5, 4, 3, 2];
const SECOND_DIGIT_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9) {
    return false;
  }

  const base = ie.slice(0, 7);
  const firstDigit = mod11CheckDigit(weightedSum(base, FIRST_DIGIT_WEIGHTS));

  if (firstDigit !== Number(ie[7])) {
    return false;
  }

  const secondDigit = mod11CheckDigit(weightedSum(base + firstDigit, SECOND_DIGIT_WEIGHTS));

  return secondDigit === Number(ie[8]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 9) {
    return value;
  }

  return ie.replace(/^(\d{7})(\d{2})$/, "$1-$2");
}

export const PE = {
  isValid,
  normalize,
  format,
};
