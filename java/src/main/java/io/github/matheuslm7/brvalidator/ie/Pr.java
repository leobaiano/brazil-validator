package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * PR: verified against the official SEFAZ-PR "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_PR.html), including its fully worked example
 * (123.45678-50), and cross-checked against the reference Visual Basic routine published on the
 * same page. Format: 8 digits + 2 check digits.
 */
final class Pr {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d.\\-\\s]+$");
  private static final int[] FIRST_DIGIT_WEIGHTS = {3, 2, 7, 6, 5, 4, 3, 2};
  private static final int[] SECOND_DIGIT_WEIGHTS = {4, 3, 2, 7, 6, 5, 4, 3, 2};

  private Pr() {}

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

    String base = v.substring(0, 8);
    int firstDigit = Mod11.mod11CheckDigit(Mod11.weightedSum(base, FIRST_DIGIT_WEIGHTS));

    if (firstDigit != (v.charAt(8) - '0')) {
      return false;
    }

    int secondDigit =
        Mod11.mod11CheckDigit(Mod11.weightedSum(base + firstDigit, SECOND_DIGIT_WEIGHTS));

    return secondDigit == (v.charAt(9) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 10) {
      return value;
    }

    return v.substring(0, 3) + "." + v.substring(3, 8) + "-" + v.substring(8, 10);
  }
}
