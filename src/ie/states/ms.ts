import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-MS "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_MS.html) for the algorithm
// (which the page does not accompany with a worked numeric example), plus
// an independently hand-computed regression vector (281234566). Format: 8
// digits (always starting with "28" or "50") + 1 check digit.
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function hasValidPrefix(ie: string): boolean {
  const prefix = ie.slice(0, 2);

  return prefix === "28" || prefix === "50";
}

function isValid(value: string): boolean {
  if (!/^[\d\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9 || !hasValidPrefix(ie)) {
    return false;
  }

  return mod11CheckDigit(weightedSum(ie, WEIGHTS)) === Number(ie[8]);
}

function format(value: string): string {
  return normalize(value);
}

export const MS = {
  isValid,
  normalize,
  format,
};
