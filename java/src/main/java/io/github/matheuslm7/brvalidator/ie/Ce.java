package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * CE: verified against the official SEFAZ-CE "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_CE.html), including its worked example (06000001-5). Format:
 * 8 digits + 1 check digit.
 */
final class Ce {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\-\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};

  private Ce() {}

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

    return Mod11.mod11CheckDigit(Mod11.weightedSum(v, WEIGHTS)) == (v.charAt(8) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 9) {
      return value;
    }

    return v.substring(0, 8) + "-" + v.substring(8, 9);
  }
}
