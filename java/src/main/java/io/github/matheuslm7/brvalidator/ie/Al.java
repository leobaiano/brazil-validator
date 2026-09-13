package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * AL: verified against the official SEFAZ-AL "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_AL.html), including its worked example (24000004 -&gt; check
 * digit 8, i.e. 240000048).
 *
 * <p>Format: "24" (fixed) + 1 "tipo de empresa" digit (0,3,5,7,8) + 5 sequence digits + 1 check
 * digit = 9 digits total. No official punctuation mask is published, so format() returns the
 * plain digits.
 */
final class Al {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};
  private static final Set<Character> VALID_TYPE_DIGITS = Set.of('0', '3', '5', '7', '8');

  private Al() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 9 || !v.startsWith("24")) {
      return false;
    }

    if (!VALID_TYPE_DIGITS.contains(v.charAt(2))) {
      return false;
    }

    int checkDigit = Mod11.mod11TimesTenCheckDigit(Mod11.weightedSum(v, WEIGHTS));

    return checkDigit == (v.charAt(8) - '0');
  }

  static String format(String value) {
    return normalize(value);
  }
}
