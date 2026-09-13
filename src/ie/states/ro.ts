import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum } from "../../shared/mod11.js";

// Verified against the official SEFAZ-RO "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RO.html), including its worked
// example (0000000062521-3). Since 01/08/2000 the format is 13 digits + 1
// check digit (the old "município + empresa" layout is superseded, with old
// registrations re-expressed by zero-padding into the new 13-digit field).
//
// The weights cycle 2-9 applied right to left over the 13 digits, i.e.
// [6,5,4,3,2,9,8,7,6,5,4,3,2] read left to right. Unlike most other states,
// a zero remainder maps to check digit 1, not 0 (the source explicitly says
// "subtract 10" from the 11-or-10 result, rather than mapping straight to 0).
const WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function calculateCheckDigit(base: string): number {
  const remainder = weightedSum(base, WEIGHTS) % 11;
  const diff = 11 - remainder;

  return diff > 9 ? diff - 10 : diff;
}

function isValid(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 14) {
    return false;
  }

  return calculateCheckDigit(ie.slice(0, 13)) === Number(ie[13]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 14) {
    return value;
  }

  return ie.replace(/^(\d{13})(\d)$/, "$1-$2");
}

export const RO = {
  isValid,
  normalize,
  format,
};
