package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * SP: verified against the official SEFAZ-SP "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_SP.html), including both of its worked examples: the standard
 * industrial/commercial format (110.042.490.114) and the "Produtor Rural" format
 * (P-01100424.3/002).
 *
 * <p>Note: the source restates the Produtor Rural example at the very end as
 * "P-011000424.3/002" (14 characters) -- this contradicts both the document's own "13
 * caracteres" rule and its worked calculation (which sums exactly 8 digits to 91, matching the
 * 13-character form). Treated as a typo in the source; the 13-character form is what this
 * module expects.
 */
final class Sp {

  private static final Pattern STANDARD_ALLOWED_CHARS = Pattern.compile("^[\\d.\\s]+$");
  private static final Pattern PRODUTOR_RURAL_ALLOWED = Pattern.compile("^[Pp\\d.\\-/\\s]+$");
  private static final Pattern FORMATTING_CHARS = Pattern.compile("[.\\-/\\s]");
  private static final Pattern PRODUTOR_RURAL_PREFIX = Pattern.compile("^\\s*[Pp]");

  private static final int[] STANDARD_FIRST_DIGIT_WEIGHTS = {1, 3, 4, 5, 6, 7, 8, 10};
  private static final int[] STANDARD_SECOND_DIGIT_WEIGHTS =
      {3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2};
  private static final int[] PRODUTOR_RURAL_WEIGHTS = {1, 3, 4, 5, 6, 7, 8, 10};

  private Sp() {}

  private static int calculateCheckDigit(String digits, int[] weights) {
    int sum = Mod11.weightedSum(digits, weights);

    if (sum % 11 == 10) {
      return 0;
    }

    return sum % 11;
  }

  private static boolean isProdutorRural(String value) {
    return PRODUTOR_RURAL_PREFIX.matcher(value).find();
  }

  private static String normalizeStandard(String value) {
    return Shared.removeNonDigits(value);
  }

  private static boolean isValidStandard(String value) {
    if (!STANDARD_ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalizeStandard(value);

    if (v.length() != 12) {
      return false;
    }

    int firstDigit = calculateCheckDigit(v, STANDARD_FIRST_DIGIT_WEIGHTS);
    if (firstDigit != (v.charAt(8) - '0')) {
      return false;
    }

    int secondDigit = calculateCheckDigit(v, STANDARD_SECOND_DIGIT_WEIGHTS);

    return secondDigit == (v.charAt(11) - '0');
  }

  private static String formatStandard(String value) {
    String v = normalizeStandard(value);

    if (v.length() != 12) {
      return value;
    }

    return v.substring(0, 3) + "." + v.substring(3, 6) + "." + v.substring(6, 9) + "."
        + v.substring(9, 12);
  }

  /**
   * Format: P0MMMSSSSD000 (13 characters) -- "P" (fixed) + "0" (fixed) + 3 município digits + 4
   * sequence digits + 1 check digit + 3 unused digits.
   */
  private static String normalizeProdutorRural(String value) {
    return FORMATTING_CHARS.matcher(value).replaceAll("").toUpperCase();
  }

  private static boolean isValidProdutorRural(String value) {
    if (!PRODUTOR_RURAL_ALLOWED.matcher(value).matches()) {
      return false;
    }

    String v = normalizeProdutorRural(value);

    if (v.length() != 13 || v.charAt(0) != 'P' || v.charAt(1) != '0') {
      return false;
    }

    String base = v.substring(1, 9);
    int checkDigit = calculateCheckDigit(base, PRODUTOR_RURAL_WEIGHTS);

    return checkDigit == (v.charAt(9) - '0');
  }

  private static String formatProdutorRural(String value) {
    String v = normalizeProdutorRural(value);

    if (v.length() != 13) {
      return value;
    }

    return "P-" + v.substring(1, 9) + "." + v.substring(9, 10) + "/" + v.substring(10, 13);
  }

  static boolean isValid(String value) {
    if (isProdutorRural(value)) {
      return isValidProdutorRural(value);
    }

    return isValidStandard(value);
  }

  static String normalize(String value) {
    if (isProdutorRural(value)) {
      return normalizeProdutorRural(value);
    }

    return normalizeStandard(value);
  }

  static String format(String value) {
    if (isProdutorRural(value)) {
      return formatProdutorRural(value);
    }

    return formatStandard(value);
  }
}
