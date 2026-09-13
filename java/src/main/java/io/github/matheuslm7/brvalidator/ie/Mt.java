package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * MT: verified against the official SEFAZ-MT "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_MT.html), including its worked example (0013000001-9).
 * Format: 10 digits + 1 check digit.
 */
final class Mt {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\-\\s]+$");
  private static final int[] WEIGHTS = {3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

  private Mt() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 11) {
      return false;
    }

    return Mod11.mod11CheckDigit(Mod11.weightedSum(v, WEIGHTS)) == (v.charAt(10) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 11) {
      return value;
    }

    return v.substring(0, 10) + "-" + v.substring(10, 11);
  }
}
