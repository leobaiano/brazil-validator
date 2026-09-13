package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * PA: verified against the official SEFAZ-PA "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_PA.html), including its two worked examples (15999999-5,
 * 75000002-3). Format: 8 digits (always starting with 15, 75, 76, 77, 78 or 79) + 1 check digit.
 */
final class Pa {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\-\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};
  private static final Set<String> VALID_PREFIXES =
      Set.of("15", "75", "76", "77", "78", "79");

  private Pa() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 9 || !VALID_PREFIXES.contains(v.substring(0, 2))) {
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
