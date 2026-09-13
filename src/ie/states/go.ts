import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-GO "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_GO.html), including its worked
// example (10.987.654-7). Format: AB.CDE.FGH-I, where AB must be 10, 11, or
// 20-29.
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function hasValidPrefix(ie: string): boolean {
  const prefix = Number(ie.slice(0, 2));

  return prefix === 10 || prefix === 11 || (prefix >= 20 && prefix <= 29);
}

function isValid(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9 || !hasValidPrefix(ie)) {
    return false;
  }

  return mod11CheckDigit(weightedSum(ie, WEIGHTS)) === Number(ie[8]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 9) {
    return value;
  }

  return ie.replace(/^(\d{2})(\d{3})(\d{3})(\d)$/, "$1.$2.$3-$4");
}

export const GO = {
  isValid,
  normalize,
  format,
};
