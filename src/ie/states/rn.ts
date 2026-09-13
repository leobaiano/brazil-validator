import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11TimesTenCheckDigit } from "../../shared/mod11.js";

// Verified against the official SEFAZ-RN "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RN.html), including both of its
// worked examples (20.040.040-1 and 20.0.040.040-0). Format: always starts
// with "20", followed by either 7 or 8 more digits, plus 1 check digit (9 or
// 10 digits total, both still valid today per the official page).
function normalize(value: string): string {
  return removeNonDigits(value);
}

function weightsFor(baseLength: number): number[] {
  return Array.from({ length: baseLength }, (_, i) => baseLength + 1 - i);
}

function isValid(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if ((ie.length !== 9 && ie.length !== 10) || !ie.startsWith("20")) {
    return false;
  }

  const base = ie.slice(0, -1);
  const checkDigit = mod11TimesTenCheckDigit(weightedSum(base, weightsFor(base.length)));

  return checkDigit === Number(ie[ie.length - 1]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length === 9) {
    return ie.replace(/^(\d{2})(\d{3})(\d{3})(\d)$/, "$1.$2.$3-$4");
  }

  if (ie.length === 10) {
    return ie.replace(/^(\d{2})(\d)(\d{3})(\d{3})(\d)$/, "$1.$2.$3.$4-$5");
  }

  return value;
}

export const RN = {
  isValid,
  normalize,
  format,
};
