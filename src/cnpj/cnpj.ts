function normalize(value: string): string {
  return value.replace(/[.\-/\s]/g, "").toUpperCase();
}

function characterValue(character: string): number {
  return character.charCodeAt(0) - 48;
}

function calculateCheckDigit(value: string): number {
  let sum = 0;
  let weight = value.length === 12 ? 5 : 6;

  for (const character of value) {
    sum += characterValue(character) * weight;

    weight--;

    if (weight === 1) {
      weight = 9;
    }
  }

  const remainder = sum % 11;

  if (remainder === 0 || remainder === 1) {
    return 0;
  }

  return 11 - remainder;
}

function isValid(value: string): boolean {
  if (!/^[A-Za-z0-9.\-/\s]+$/.test(value)) {
    return false;
  }

  const cnpj = normalize(value);

  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
    return false;
  }

  const firstDigit = calculateCheckDigit(cnpj.slice(0, 12));

  if (firstDigit !== Number(cnpj[12])) {
    return false;
  }

  const secondDigit = calculateCheckDigit(cnpj.slice(0, 13));

  return secondDigit === Number(cnpj[13]);
}

function format(value: string): string {
  const cnpj = normalize(value);

  if (cnpj.length !== 14) {
    return value;
  }

  return cnpj.replace(/^(.{2})(.{3})(.{3})(.{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export const CNPJ = {
  isValid,
  normalize,
  format,
};
