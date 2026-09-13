import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-AC "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_AC.html), including its worked
// example (01.004.823/001-12). Format: 11 digits (always starting with "01")
// + 2 check digits.
const FIRST_DIGIT_WEIGHTS = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_DIGIT_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d./\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 13 || !ie.startsWith("01")) {
    return false;
  }

  const firstDigit = mod11CheckDigit(weightedSum(ie, FIRST_DIGIT_WEIGHTS));

  if (firstDigit !== Number(ie[11])) {
    return false;
  }

  const secondDigit = mod11CheckDigit(weightedSum(ie, SECOND_DIGIT_WEIGHTS));

  return secondDigit === Number(ie[12]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 13) {
    return value;
  }

  return ie.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export const AC = {
  isValid,
  normalize,
  format,
};
