import { removeNonDigits } from "../../shared/normalize.js";

// Verified against the official SEFAZ-RJ "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RJ.html) for the check-digit
// rule, and cross-checked against a worked example (99.999.99-3) for the
// weights, which the Sintegra page itself does not enumerate.
const WEIGHTS = [2, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function calculateCheckDigit(digits: string): number {
  let sum = 0;

  for (let i = 0; i < WEIGHTS.length; i++) {
    sum += Number(digits[i]) * WEIGHTS[i]!;
  }

  const remainder = sum % 11;

  return remainder <= 1 ? 0 : 11 - remainder;
}

function isValid(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 8) {
    return false;
  }

  return calculateCheckDigit(ie) === Number(ie[7]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 8) {
    return value;
  }

  return ie.replace(/^(\d{2})(\d{3})(\d{2})(\d)$/, "$1.$2.$3-$4");
}

export const RJ = {
  isValid,
  normalize,
  format,
};
