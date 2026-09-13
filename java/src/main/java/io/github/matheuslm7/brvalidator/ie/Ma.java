package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * MA: verified against the official SEFAZ-MA "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_MA.html), including its worked example (120000385).
 *
 * <p>Format: "12" (fixed) + 6 sequence digits + 1 check digit = 9 digits total. No official
 * punctuation mask is published, so format() returns plain digits.
 */
final class Ma {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};

  private Ma() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 9 || !v.startsWith("12")) {
      return false;
    }

    return Mod11.mod11CheckDigit(Mod11.weightedSum(v, WEIGHTS)) == (v.charAt(8) - '0');
  }

  static String format(String value) {
    return normalize(value);
  }
}
