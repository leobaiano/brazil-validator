import { removeNonDigits } from "../../shared/normalize.js";
import { weightedSum, mod11CheckDigit } from "../../shared/mod11.js";

// SEFAZ-DF's own Sintegra "Roteiro de Crítica" page
// (sintegra.gov.br/Cad_Estados/cad_DF.html) is empty, so this was instead
// cross-verified against two independent secondary sources that agree with
// each other (cadcobol.com.br's fully worked example, arithmetic re-checked
// by hand, and mestredocalculo.com.br independently citing the same valid
// example "07.300.001.001-09"). The algorithm is structurally identical to
// AC's officially-confirmed one (same weight sequences), differing only in
// the fixed "07" prefix — strong evidence both derive from the same
// original SEFAZ documentation. Format: "07" (fixed) + 6 sequence digits +
// 3 "ordem do estabelecimento" digits (001 = matriz) + 2 check digits = 13
// digits total.
const FIRST_DIGIT_WEIGHTS = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_DIGIT_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function normalize(value: string): string {
  return removeNonDigits(value);
}

function isValid(value: string): boolean {
  if (!/^[\d./\-\s]+$/.test(value)) {
    return false;
  }

  const ie = normalize(value);

  if (ie.length !== 13 || !ie.startsWith("07")) {
    return false;
  }

  const firstDigit = mod11CheckDigit(weightedSum(ie, FIRST_DIGIT_WEIGHTS));

  if (firstDigit !== Number(ie[11])) {
    return false;
  }

  const secondDigit = mod11CheckDigit(weightedSum(ie, SECOND_DIGIT_WEIGHTS));

  return secondDigit === Number(ie[12]);
}

function format(value: string): string {
  const ie = normalize(value);

  if (ie.length !== 13) {
    return value;
  }

  return ie.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3.$4-$5");
}

export const DF = {
  isValid,
  normalize,
  format,
};
