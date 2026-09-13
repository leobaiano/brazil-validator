package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * MS: verified against the official SEFAZ-MS "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_MS.html) for the algorithm (which the page does not
 * accompany with a worked numeric example), plus an independently hand-computed regression
 * vector (281234566). Format: 8 digits (always starting with "28" or "50") + 1 check digit.
 */
final class Ms {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};

  private Ms() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static boolean hasValidPrefix(String v) {
    String prefix = v.substring(0, 2);
    return prefix.equals("28") || prefix.equals("50");
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 9 || !hasValidPrefix(v)) {
      return false;
    }

    return Mod11.mod11CheckDigit(Mod11.weightedSum(v, WEIGHTS)) == (v.charAt(8) - '0');
  }

  static String format(String value) {
    return normalize(value);
  }
}
