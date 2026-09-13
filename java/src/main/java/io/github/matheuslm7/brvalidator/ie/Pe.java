package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * PE: verified against the official SEFAZ-PE "Roteiro de Crítica da Inscrição Estadual" for the
 * e-Fisco system (sintegra.gov.br/Cad_Estados/cad_PE.html), including its fully worked example
 * (0321418-40). Format: 7 digits + 2 check digits.
 */
final class Pe {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\-\\s]+$");
  private static final int[] FIRST_DIGIT_WEIGHTS = {8, 7, 6, 5, 4, 3, 2};
  private static final int[] SECOND_DIGIT_WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};

  private Pe() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 9) {
      return false;
    }

    String base = v.substring(0, 7);
    int firstDigit = Mod11.mod11CheckDigit(Mod11.weightedSum(base, FIRST_DIGIT_WEIGHTS));

    if (firstDigit != (v.charAt(7) - '0')) {
      return false;
    }

    int secondDigit =
        Mod11.mod11CheckDigit(Mod11.weightedSum(base + firstDigit, SECOND_DIGIT_WEIGHTS));

    return secondDigit == (v.charAt(8) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 9) {
      return value;
    }

    return v.substring(0, 7) + "-" + v.substring(7, 9);
  }
}
