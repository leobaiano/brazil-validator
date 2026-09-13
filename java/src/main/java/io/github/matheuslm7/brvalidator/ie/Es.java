package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * ES: verified against the official SEFAZ-ES "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_ES.html), including its worked example (all-9s base -&gt; sum
 * 396). Format: 8 digits + 1 check digit. No official punctuation mask is published, so format()
 * returns plain digits.
 */
final class Es {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};

  private Es() {}

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
    return normalize(value);
  }
}
