import { removeNonDigits } from "../../shared/normalize.js";

// Verified against the official SEFAZ-SP "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_SP.html), including both of
// its worked examples: the standard industrial/commercial format
// (110.042.490.114) and the "Produtor Rural" format (P-01100424.3/002).
//
// Note: the source restates the Produtor Rural example at the very end as
// "P-011000424.3/002" (14 characters) — this contradicts both the
// document's own "13 caracteres" rule and its worked calculation (which
// sums exactly 8 digits to 91, matching the 13-character form). Treated as
// a typo in the source; the 13-character form is what this module expects.
const STANDARD_FIRST_DIGIT_WEIGHTS = [1, 3, 4, 5, 6, 7, 8, 10];
const STANDARD_SECOND_DIGIT_WEIGHTS = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PRODUTOR_RURAL_WEIGHTS = [1, 3, 4, 5, 6, 7, 8, 10];

function calculateCheckDigit(digits: string, weights: number[]): number {
  let sum = 0;

  for (let i = 0; i < weights.length; i++) {
    sum += Number(digits[i]) * weights[i]!;
  }

  return sum % 11 === 10 ? 0 : sum % 11;
}

function isProdutorRural(value: string): boolean {
  return /^\s*[Pp]/.test(value);
}

function normalizeStandard(value: string): string {
  return removeNonDigits(value);
}

function isValidStandard(value: string): boolean {
  if (!/^[\d.\s]+$/.test(value)) {
    return false;
  }

  const ie = normalizeStandard(value);

  if (ie.length !== 12) {
    return false;
  }

  const firstDigit = calculateCheckDigit(ie, STANDARD_FIRST_DIGIT_WEIGHTS);

  if (firstDigit !== Number(ie[8])) {
    return false;
  }

  const secondDigit = calculateCheckDigit(ie, STANDARD_SECOND_DIGIT_WEIGHTS);

  return secondDigit === Number(ie[11]);
}

function formatStandard(value: string): string {
  const ie = normalizeStandard(value);

  if (ie.length !== 12) {
    return value;
  }

  return ie.replace(/^(\d{3})(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3.$4");
}

// Format: P0MMMSSSSD000 (13 characters) — "P" (fixed) + "0" (fixed) + 3
// município digits + 4 sequence digits + 1 check digit + 3 unused digits.
function normalizeProdutorRural(value: string): string {
  return value.replace(/[.\-/\s]/g, "").toUpperCase();
}

function isValidProdutorRural(value: string): boolean {
  if (!/^[Pp\d.\-/\s]+$/.test(value)) {
    return false;
  }

  const ie = normalizeProdutorRural(value);

  if (ie.length !== 13 || ie[0] !== "P" || ie[1] !== "0") {
    return false;
  }

  const base = ie.slice(1, 9);
  const checkDigit = calculateCheckDigit(base, PRODUTOR_RURAL_WEIGHTS);

  return checkDigit === Number(ie[9]);
}

function formatProdutorRural(value: string): string {
  const ie = normalizeProdutorRural(value);

  if (ie.length !== 13) {
    return value;
  }

  return `P-${ie.slice(1, 9)}.${ie[9]}/${ie.slice(10, 13)}`;
}

function isValid(value: string): boolean {
  return isProdutorRural(value) ? isValidProdutorRural(value) : isValidStandard(value);
}

function normalize(value: string): string {
  return isProdutorRural(value) ? normalizeProdutorRural(value) : normalizeStandard(value);
}

function format(value: string): string {
  return isProdutorRural(value) ? formatProdutorRural(value) : formatStandard(value);
}

export const SP = {
  isValid,
  normalize,
  format,
};
