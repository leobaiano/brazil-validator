import { removeNonDigits } from "../shared/normalize.js";

function normalize(value: string): string {
  return removeNonDigits(value);
}

// CEP has no check-digit algorithm: it is an 8-digit postal routing code
// (region, sub-region, sector, subsector and distribution suffix), so
// validity here means structural correctness, not existence in Correios'
// address database.
function isValid(value: string): boolean {
  if (!/^[\d-]+$/.test(value)) {
    return false;
  }

  const cep = normalize(value);

  return cep.length === 8;
}

function format(value: string): string {
  const cep = normalize(value);

  if (cep.length !== 8) {
    return value;
  }

  return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
}

export const CEP = {
  isValid,
  normalize,
  format,
};
