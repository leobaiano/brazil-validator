import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod10CheckDigit, mod11CheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-BA "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_BA.html), including its four
// worked examples (123456-63, 612345-57, 1000003-06 mod-10/mod-11 x
// 8/9-digit variants).
//
// Bahia has two lengths (8 or 9 digits) and, within each, two moduli: módulo
// 10 when the discriminating digit (the 1st digit for 8-digit IEs, the 2nd
// for 9-digit IEs) is one of 0,1,2,3,4,5,8, and módulo 11 when it is 6, 7 or
// 9. The last check digit is calculated first (from the base digits alone),
// then the first check digit is calculated from the base plus that digit.
const MOD10_DIGITS = new Set(["0", "1", "2", "3", "4", "5", "8"]);
const MOD11_DIGITS = new Set(["6", "7", "9"]);

function normalize(value: string): string {
  return removeNonDigits(value);
}

function checkDigitFor(sum: number, useMod11: boolean): number {
  return useMod11 ? mod11CheckDigit(sum) : mod10CheckDigit(sum);
}

function isValid(value: string): boolean {
  if (!/^[\d\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 8 && ie.length !== 9) {
    return false;
  }

  const discriminant = ie.length === 8 ? ie[0] : ie[1];

  if (!discriminant) {
    return false;
  }

  const useMod11 = MOD11_DIGITS.has(discriminant);

  if (!useMod11 && !MOD10_DIGITS.has(discriminant)) {
    return false;
  }

  const baseLength = ie.length - 2;
  const base = ie.slice(0, baseLength);
  const lastDigitWeights = Array.from({ length: baseLength }, (_, i) => baseLength + 1 - i);
  const lastDigit = checkDigitFor(weightedSum(base, lastDigitWeights), useMod11);

  if (lastDigit !== Number(ie[ie.length - 1])) {
    return false;
  }

  const firstDigitWeights = Array.from({ length: baseLength + 1 }, (_, i) => baseLength + 2 - i);
  const firstDigit = checkDigitFor(weightedSum(base + lastDigit, firstDigitWeights), useMod11);

  return firstDigit === Number(ie[ie.length - 2]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 8 && ie.length !== 9) {
    return value;
  }

  return `${ie.slice(0, -2)}-${ie.slice(-2)}`;
}

export const BA = {
  isValid,
  normalize,
  format,
};
