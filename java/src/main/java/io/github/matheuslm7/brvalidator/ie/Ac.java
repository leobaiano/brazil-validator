package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * AC: verified against the official SEFAZ-AC "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_AC.html), including its worked example
 * (01.004.823/001-12). Format: 11 digits (always starting with "01") + 2 check digits.
 */
final class Ac {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d./\\-\\s]+$");
  private static final int[] FIRST_DIGIT_WEIGHTS = {4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
  private static final int[] SECOND_DIGIT_WEIGHTS = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

  private Ac() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 13 || !v.startsWith("01")) {
      return false;
    }

    int firstDigit = Mod11.mod11CheckDigit(Mod11.weightedSum(v, FIRST_DIGIT_WEIGHTS));
    if (firstDigit != (v.charAt(11) - '0')) {
      return false;
    }

    int secondDigit = Mod11.mod11CheckDigit(Mod11.weightedSum(v, SECOND_DIGIT_WEIGHTS));

    return secondDigit == (v.charAt(12) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 13) {
      return value;
    }

    return v.substring(0, 2) + "." + v.substring(2, 5) + "." + v.substring(5, 8) + "/"
        + v.substring(8, 11) + "-" + v.substring(11, 13);
  }
}
