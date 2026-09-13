package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * RJ: verified against the official SEFAZ-RJ "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_RJ.html) for the check-digit rule, and cross-checked against
 * a worked example (99.999.99-3) for the weights, which the Sintegra page itself does not
 * enumerate.
 */
final class Rj {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d.\\-\\s]+$");
  private static final int[] WEIGHTS = {2, 7, 6, 5, 4, 3, 2};

  private Rj() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static int calculateCheckDigit(String v) {
    int sum = Mod11.weightedSum(v, WEIGHTS);
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

    if (v.length() != 8) {
      return false;
    }

    return calculateCheckDigit(v) == (v.charAt(7) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 8) {
      return value;
    }

    return v.substring(0, 2) + "." + v.substring(2, 5) + "." + v.substring(5, 7) + "-"
        + v.substring(7, 8);
  }
}
