package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * RR: verified against the official SEFAZ-RR "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_RR.html), including its worked example (24006153-6) and the
 * ten additional valid numbers it lists. Format: "24" (fixed) + 6 sequence digits + 1 check
 * digit = 9 digits total. Unlike every other state, the check digit uses módulo 9, and the
 * weights are the digit's own 1-based position (ascending, not descending).
 */
final class Rr {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\-\\s]+$");
  private static final int[] WEIGHTS = {1, 2, 3, 4, 5, 6, 7, 8};

  private Rr() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 9 || !v.startsWith("24")) {
      return false;
    }

    int checkDigit = Mod11.weightedSum(v, WEIGHTS) % 9;

    return checkDigit == (v.charAt(8) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 9) {
      return value;
    }

    return v.substring(0, 8) + "-" + v.substring(8, 9);
  }
}
