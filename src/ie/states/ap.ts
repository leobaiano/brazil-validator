import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum } from "../../shared/mod11.js";

// Verified against the official SEFAZ-AP "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_AP.html), including its worked
// example (030123459). Format: "03" (fixed) + 6 sequence digits + 1 check
// digit = 9 digits total. Unlike other states, the weighted sum starts from
// a constant "p" that depends on the numeric range of the registration, and
// a zero remainder maps to a range-dependent digit "d" instead of always 0.
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function resolveConstants(base: number): { p: number; d: number } {
  if (base <= 3017000) {
    return { p: 5, d: 0 };
  }

  if (base <= 3019022) {
    return { p: 9, d: 1 };
  }

  return { p: 0, d: 0 };
}

function calculateCheckDigit(ie: string): number {
  const base = ie.slice(0, 8);
  const { p, d } = resolveConstants(Number(base));
  const sum = p + weightedSum(base, WEIGHTS);
  const remainder = sum % 11;

  if (remainder === 1) {
    return 0;
  }

  if (remainder === 0) {
    return d;
  }

  return 11 - remainder;
}

function isValid(value: string): boolean {
  if (!/^[\d\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 9 || !ie.startsWith("03")) {
    return false;
  }

  return calculateCheckDigit(ie) === Number(ie[8]);
}

function format(value: string): string {
  return normalize(value);
}

export const AP = {
  isValid,
  normalize,
  format,
};
