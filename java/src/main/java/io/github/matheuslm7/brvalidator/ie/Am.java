package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * AM: verified against the official SEFAZ-AM "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_AM.html). Format: 99.999.999-9 (8 digits + 1 check digit).
 * Unlike most other states, when the weighted sum itself is below 11 the digit is 11 minus the
 * sum directly (skipping the modulo step).
 */
final class Am {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d.\\-\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};

  private Am() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static int calculateCheckDigit(String v) {
    int sum = Mod11.weightedSum(v, WEIGHTS);

    if (sum < 11) {
      return 11 - sum;
    }

    return Mod11.mod11CheckDigit(sum);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 9) {
      return false;
    }

    return calculateCheckDigit(v) == (v.charAt(8) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 9) {
      return value;
    }

    return v.substring(0, 2) + "." + v.substring(2, 5) + "." + v.substring(5, 8) + "-"
        + v.substring(8, 9);
  }
}
