package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * RS: verified against the official SEFAZ-RS "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_RS.html), including its worked example (224/3658792).
 * Format: 3 digits (município) + 6 digits (empresa) + 1 check digit = 10 digits total.
 */
final class Rs {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d/\\s]+$");
  private static final int[] WEIGHTS = {2, 9, 8, 7, 6, 5, 4, 3, 2};

  private Rs() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 10) {
      return false;
    }

    return Mod11.mod11CheckDigit(Mod11.weightedSum(v, WEIGHTS)) == (v.charAt(9) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 10) {
      return value;
    }

    return v.substring(0, 3) + "/" + v.substring(3, 10);
  }
}
