import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-SC "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_SC.html), including its worked
// example (251.040.852). Format: 8 digits + 1 check digit.
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d.\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9) {
    return false;
  }

  return mod11CheckDigit(weightedSum(ie, WEIGHTS)) === Number(ie[8]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 9) {
    return value;
  }

  return ie.replace(/^(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3");
}

export const SC = {
  isValid,
  normalize,
  format,
};
