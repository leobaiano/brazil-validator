function normalize(value: string): string {
  return value.replace(/\D/g, "");
}

function calculateCheckDigit(cpf: string, weight: number): number {
  let sum = 0;

  for (let i = 0; i < cpf.length; i++) {
    sum += Number(cpf[i]) * (weight - i);
  }

  let remainder = (sum * 10) % 11;

  if (remainder === 10) {
    remainder = 0;
  }

  return remainder;
}

function isValid(value: string): boolean {
  if (!/^[\d.\-\s]+$/.test(value)) {
    return false;
  }

  const cpf = normalize(value);

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const firstDigit = calculateCheckDigit(cpf.slice(0, 9), 10);

  if (firstDigit !== Number(cpf[9])) {
    return false;
  }

  const secondDigit = calculateCheckDigit(cpf.slice(0, 10), 11);

  return secondDigit === Number(cpf[10]);
}

function format(value: string): string {
  const cpf = normalize(value);

  if (cpf.length !== 11) {
    return value;
  }

  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

export const CPF = {
  isValid,
  normalize,
  format,
};
