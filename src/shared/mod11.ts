// Shared by most Inscrição Estadual algorithms (SEFAZ "Roteiro de Crítica"
// documents): weight each digit, sum the products, then reduce modulo 11.
export function weightedSum(digits: string, weights: number[]): number {
  let sum = 0;

  for (let i = 0; i < weights.length; i++) {
    sum += Number(digits[i]) * weights[i]!;
  }

  return sum;
}

// The most common check-digit rule across states: remainder 0 or 1 maps to
// digit 0, otherwise the digit is 11 minus the remainder.
export function mod11CheckDigit(sum: number): number {
  const remainder = sum % 11;

  return remainder <= 1 ? 0 : 11 - remainder;
}

// Used by Bahia's módulo-10 branch: remainder 0 maps to digit 0, otherwise
// the digit is 10 minus the remainder.
export function mod10CheckDigit(sum: number): number {
  const remainder = sum % 10;

  return remainder === 0 ? 0 : 10 - remainder;
}

// Used by Alagoas and Rio Grande do Norte: the sum is multiplied by 10
// before reducing modulo 11, and the remainder *is* the digit directly
// (a remainder of 10 wraps to 0). This mirrors CPF's check-digit formula.
export function mod11TimesTenCheckDigit(sum: number): number {
  const remainder = (sum * 10) % 11;

  return remainder === 10 ? 0 : remainder;
}
