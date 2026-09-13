package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * AP: verified against the official SEFAZ-AP "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_AP.html), including its worked example (030123459).
 *
 * <p>Format: "03" (fixed) + 6 sequence digits + 1 check digit = 9 digits total. Unlike other
 * states, the weighted sum starts from a constant "p" that depends on the numeric range of the
 * registration, and a zero remainder maps to a range-dependent digit "d" instead of always 0.
 */
final class Ap {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};

  private Ap() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static int[] resolveConstants(int base) {
    if (base <= 3017000) {
      return new int[] {5, 0};
    }

    if (base <= 3019022) {
      return new int[] {9, 1};
    }

    return new int[] {0, 0};
  }

  private static int calculateCheckDigit(String v) {
    String base = v.substring(0, 8);
    int[] pd = resolveConstants(Integer.parseInt(base));
    int p = pd[0];
    int d = pd[1];
    int sum = p + Mod11.weightedSum(base, WEIGHTS);
    int remainder = sum % 11;

    if (remainder == 1) {
      return 0;
    }

    if (remainder == 0) {
      return d;
    }

    return 11 - remainder;
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 9 || !v.startsWith("03")) {
      return false;
    }

    return calculateCheckDigit(v) == (v.charAt(8) - '0');
  }

  static String format(String value) {
    return normalize(value);
  }
}
