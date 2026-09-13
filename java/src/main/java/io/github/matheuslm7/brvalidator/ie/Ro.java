package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * RO: verified against the official SEFAZ-RO "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_RO.html), including its worked example
 * (0000000062521-3). Since 01/08/2000 the format is 13 digits + 1 check digit (the old
 * "município + empresa" layout is superseded, with old registrations re-expressed by
 * zero-padding into the new 13-digit field).
 *
 * <p>The weights cycle 2-9 applied right to left over the 13 digits, i.e.
 * [6,5,4,3,2,9,8,7,6,5,4,3,2] read left to right. Unlike most other states, a zero remainder
 * maps to check digit 1, not 0 (the source explicitly says "subtract 10" from the 11-or-10
 * result, rather than mapping straight to 0).
 */
final class Ro {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d.\\-\\s]+$");
  private static final int[] WEIGHTS = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

  private Ro() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static int calculateCheckDigit(String base) {
    int remainder = Mod11.weightedSum(base, WEIGHTS) % 11;
    int diff = 11 - remainder;

    if (diff > 9) {
      return diff - 10;
    }

    return diff;
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 14) {
      return false;
    }

    return calculateCheckDigit(v.substring(0, 13)) == (v.charAt(13) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 14) {
      return value;
    }

    return v.substring(0, 13) + "-" + v.substring(13, 14);
  }
}
