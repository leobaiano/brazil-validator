import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-PA "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_PA.html), including its two
// worked examples (15999999-5, 75000002-3). Format: 8 digits (always
// starting with 15, 75, 76, 77, 78 or 79) + 1 check digit.
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];
const VALID_PREFIXES = new Set(["15", "75", "76", "77", "78", "79"]);

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9 || !VALID_PREFIXES.has(ie.slice(0, 2))) {
    return false;
  }

  return mod11CheckDigit(weightedSum(ie, WEIGHTS)) === Number(ie[8]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 9) {
    return value;
  }

  return ie.replace(/^(\d{8})(\d)$/, "$1-$2");
}

export const PA = {
  isValid,
  normalize,
  format,
};
