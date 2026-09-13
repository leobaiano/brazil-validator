import { removeNonDigits } from "../../shared/normalize.js";

// Verified against the official SEFAZ-MG "Roteiro de Crítica da Inscrição
// Estadual" (mirrored at sintegra.gov.br/Cad_Estados/cad_MG.html), including
// its fully worked example (062.307.904/0081).
//
// Format: A1A2A3 B1B2B3B4B5B6 C1C2 D1D2 (13 digits), where A = município
// code, B = registration number, C = establishment order, D = check digits.
const FIRST_DIGIT_WEIGHTS = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
const SECOND_DIGIT_WEIGHTS = [3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function sumOfDigits(value: number): number {
  return String(value)
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

// D1 equalizes the field widths by inserting a "0" right after the
// município code, then sums the *digits* of each weighted product (not the
// products themselves) before completing to the next multiple of ten.
function calculateFirstDigit(base: string): number {
  const withInsertedZero = `${base.slice(0, 3)}0${base.slice(3)}`;

  let digitSum = 0;

  for (let i = 0; i < FIRST_DIGIT_WEIGHTS.length; i++) {
    digitSum += sumOfDigits(Number(withInsertedZero[i]) * FIRST_DIGIT_WEIGHTS[i]!);
  }

  const remainder = digitSum % 10;

  return remainder === 0 ? 0 : 10 - remainder;
}

// D2 uses the original (un-padded) base plus D1, and sums the weighted
// products directly, following the general módulo 11 remainder rule.
function calculateSecondDigit(base: string, firstDigit: number): number {
  const withFirstDigit = `${base}${firstDigit}`;

  let sum = 0;

  for (let i = 0; i < SECOND_DIGIT_WEIGHTS.length; i++) {
    sum += Number(withFirstDigit[i]) * SECOND_DIGIT_WEIGHTS[i]!;
  }

  const remainder = sum % 11;

  return remainder <= 1 ? 0 : 11 - remainder;
}

function isValid(value: string): boolean {
  if (!/^[\d./\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 13) {
    return false;
  }

  const base = ie.slice(0, 11);
  const firstDigit = calculateFirstDigit(base);

  if (firstDigit !== Number(ie[11])) {
    return false;
  }

  const secondDigit = calculateSecondDigit(base, firstDigit);

  return secondDigit === Number(ie[12]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 13) {
    return value;
  }

  return ie.replace(/^(\d{3})(\d{3})(\d{3})(\d{4})$/, "$1.$2.$3/$4");
}

export const MG = {
  isValid,
  normalize,
  format,
};
