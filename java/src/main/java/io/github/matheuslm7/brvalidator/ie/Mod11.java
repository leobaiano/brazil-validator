package io.github.matheuslm7.brvalidator.ie;

/**
 * Shared by most Inscrição Estadual algorithms (SEFAZ "Roteiro de Crítica" documents): weight
 * each digit, sum the products, then reduce modulo 11.
 *
 * <p>Package-private: not part of the public API.
 */
final class Mod11 {

  private Mod11() {}

  static int weightedSum(String digits, int[] weights) {
    int sum = 0;

    for (int i = 0; i < weights.length; i++) {
      sum += (digits.charAt(i) - '0') * weights[i];
    }

    return sum;
  }

  /**
   * The most common check-digit rule across states: remainder 0 or 1 maps to digit 0, otherwise
   * the digit is 11 minus the remainder.
   */
  static int mod11CheckDigit(int sum) {
    int remainder = sum % 11;

    if (remainder <= 1) {
      return 0;
    }

    return 11 - remainder;
  }

  /**
   * Used by Bahia's módulo-10 branch: remainder 0 maps to digit 0, otherwise the digit is 10
   * minus the remainder.
   */
  static int mod10CheckDigit(int sum) {
    int remainder = sum % 10;

    if (remainder == 0) {
      return 0;
    }

    return 10 - remainder;
  }

  /**
   * Used by Alagoas and Rio Grande do Norte: the sum is multiplied by 10 before reducing modulo
   * 11, and the remainder *is* the digit directly (a remainder of 10 wraps to 0). Mirrors CPF's
   * check-digit formula.
   */
  static int mod11TimesTenCheckDigit(int sum) {
    int remainder = (sum * 10) % 11;

    if (remainder == 10) {
      return 0;
    }

    return remainder;
  }
}
