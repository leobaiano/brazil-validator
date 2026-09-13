package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * GO: verified against the official SEFAZ-GO "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_GO.html), including its worked example (10.987.654-7).
 * Format: AB.CDE.FGH-I, where AB must be 10, 11, or 20-29.
 */
final class Go {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d.\\-\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};

  private Go() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static boolean hasValidPrefix(String v) {
    int prefix = Integer.parseInt(v.substring(0, 2));

    return prefix == 10 || prefix == 11 || (prefix >= 20 && prefix <= 29);
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
    String v = normalize(value);

    if (v.length() != 9) {
      return value;
    }

    return v.substring(0, 2) + "." + v.substring(2, 5) + "." + v.substring(5, 8) + "-"
        + v.substring(8, 9);
  }
}
