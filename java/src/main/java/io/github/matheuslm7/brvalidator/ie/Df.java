package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * DF: SEFAZ-DF's own Sintegra "Roteiro de Crítica" page
 * (sintegra.gov.br/Cad_Estados/cad_DF.html) is empty, so this was instead cross-verified against
 * two independent secondary sources that agree with each other (cadcobol.com.br's fully worked
 * example, arithmetic re-checked by hand, and mestredocalculo.com.br independently citing the
 * same valid example "07.300.001.001-09"). The algorithm is structurally identical to AC's
 * officially-confirmed one (same weight sequences), differing only in the fixed "07" prefix --
 * strong evidence both derive from the same original SEFAZ documentation.
 *
 * <p>Format: "07" (fixed) + 6 sequence digits + 3 "ordem do estabelecimento" digits (001 =
 * matriz) + 2 check digits = 13 digits total.
 */
final class Df {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d./\\-\\s]+$");
  private static final int[] FIRST_DIGIT_WEIGHTS = {4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
  private static final int[] SECOND_DIGIT_WEIGHTS = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

  private Df() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 13 || !v.startsWith("07")) {
      return false;
    }

    int firstDigit = Mod11.mod11CheckDigit(Mod11.weightedSum(v, FIRST_DIGIT_WEIGHTS));
    if (firstDigit != (v.charAt(11) - '0')) {
      return false;
    }

    int secondDigit = Mod11.mod11CheckDigit(Mod11.weightedSum(v, SECOND_DIGIT_WEIGHTS));

    return secondDigit == (v.charAt(12) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 13) {
      return value;
    }

    return v.substring(0, 2) + "." + v.substring(2, 5) + "." + v.substring(5, 8) + "."
        + v.substring(8, 11) + "-" + v.substring(11, 13);
  }
}
