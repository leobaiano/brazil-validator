import { removeNonDigits } from "../../shared/normalize.js";
import { mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-TO "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_TO.html), including its worked
// example (29010227836). Format: 11 digits, where positions 3-4 hold a fixed
// "tipo" code (01 Produtor Rural, 02 Indústria e Comércio, 03 Empresas
// Rudimentares, 99 Cadastro Antigo) that is excluded from the check-digit
// calculation, and position 11 is the check digit.
const WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];
const VALID_TYPE_CODES = new Set(["01", "02", "03", "99"]);
// 1-based positions used in the check-digit calculation (positions 3-4 are
// skipped).
const DIGIT_POSITIONS = [1, 2, 5, 6, 7, 8, 9, 10];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 11 || !VALID_TYPE_CODES.has(ie.slice(2, 4))) {
    return false;
  }

  let sum = 0;

  for (let i = 0; i < DIGIT_POSITIONS.length; i++) {
    const digit = ie[DIGIT_POSITIONS[i]! - 1];
    sum += Number(digit) * WEIGHTS[i]!;
  }

  return mod11CheckDigit(sum) === Number(ie[10]);
}

function format(value: string): string {
  return normalize(value);
}

export const TO = {
  isValid,
  normalize,
  format,
};
