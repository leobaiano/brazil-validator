package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * MG: verified against the official SEFAZ-MG "Roteiro de Crítica da Inscrição Estadual"
 * (mirrored at sintegra.gov.br/Cad_Estados/cad_MG.html), including its fully worked example
 * (062.307.904/0081).
 *
 * <p>Format: A1A2A3 B1B2B3B4B5B6 C1C2 D1D2 (13 digits), where A = município code, B =
 * registration number, C = establishment order, D = check digits.
 */
final class Mg {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d./\\s]+$");
  private static final int[] FIRST_DIGIT_WEIGHTS = {1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2};
  private static final int[] SECOND_DIGIT_WEIGHTS = {3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2};

  private Mg() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static int sumOfDigits(int value) {
    int sum = 0;
    for (char c : String.valueOf(value).toCharArray()) {
      sum += c - '0';
    }
    return sum;
  }

  /**
   * D1 equalizes the field widths by inserting a "0" right after the município code, then sums
   * the *digits* of each weighted product (not the products themselves) before completing to the
   * next multiple of ten.
   */
  private static int calculateFirstDigit(String base) {
    String withInsertedZero = base.substring(0, 3) + "0" + base.substring(3);

    int digitSum = 0;
    for (int i = 0; i < FIRST_DIGIT_WEIGHTS.length; i++) {
      digitSum += sumOfDigits((withInsertedZero.charAt(i) - '0') * FIRST_DIGIT_WEIGHTS[i]);
    }

    int remainder = digitSum % 10;

    if (remainder == 0) {
      return 0;
    }

    return 10 - remainder;
  }

  /**
   * D2 uses the original (un-padded) base plus D1, and sums the weighted products directly,
   * following the general módulo 11 remainder rule.
   */
  private static int calculateSecondDigit(String base, int firstDigit) {
    String withFirstDigit = base + firstDigit;

    int sum = Mod11.weightedSum(withFirstDigit, SECOND_DIGIT_WEIGHTS);
    int remainder = sum % 11;

    if (remainder <= 1) {
      return 0;
    }

    return 11 - remainder;
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 13) {
      return false;
    }

    String base = v.substring(0, 11);
    int firstDigit = calculateFirstDigit(base);

    if (firstDigit != (v.charAt(11) - '0')) {
      return false;
    }

    int secondDigit = calculateSecondDigit(base, firstDigit);

    return secondDigit == (v.charAt(12) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 13) {
      return value;
    }

    return v.substring(0, 3) + "." + v.substring(3, 6) + "." + v.substring(6, 9) + "/"
        + v.substring(9, 13);
  }
}
