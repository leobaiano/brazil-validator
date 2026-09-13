import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-RS "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RS.html), including its worked
// example (224/3658792). Format: 3 digits (município) + 6 digits (empresa) +
// 1 check digit = 10 digits total.
const WEIGHTS = [2, 9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d/\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 10) {
    return false;
  }

  return mod11CheckDigit(weightedSum(ie, WEIGHTS)) === Number(ie[9]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 10) {
    return value;
  }

  return ie.replace(/^(\d{3})(\d{7})$/, "$1/$2");
}

export const RS = {
  isValid,
  normalize,
  format,
};
