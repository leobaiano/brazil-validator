package io.github.matheuslm7.brvalidator;

import java.util.regex.Pattern;

/**
 * Validates, normalizes, and formats Brazilian CNPJ numbers.
 *
 * <p>Covers both the traditional numeric format and the alphanumeric format introduced by
 * Receita Federal.
 */
public final class Cnpj {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[A-Za-z0-9.\\-/\\s]+$");
  private static final Pattern FORMATTING_CHARS = Pattern.compile("[.\\-/\\s]");
  private static final Pattern NORMALIZED_SHAPE = Pattern.compile("^[A-Z0-9]{12}\\d{2}$");

  private Cnpj() {}

  /**
   * Strips formatting and uppercases value.
   *
   * <p>A digit-only strip would destroy alphanumeric CNPJ values, so only separator characters
   * are removed.
   */
  public static String normalize(String value) {
    return FORMATTING_CHARS.matcher(value).replaceAll("").toUpperCase();
  }

  private static int characterValue(char c) {
    return c - 48;
  }

  private static int calculateCheckDigit(String value) {
    int sum = 0;
    int weight = value.length() == 12 ? 5 : 6;

    for (int i = 0; i < value.length(); i++) {
      sum += characterValue(value.charAt(i)) * weight;
      weight--;

      if (weight == 1) {
        weight = 9;
      }
    }

    int remainder = sum % 11;

    if (remainder == 0 || remainder == 1) {
      return 0;
    }

    return 11 - remainder;
  }

  /**
   * Returns true if value is a structurally and check-digit valid CNPJ, numeric or alphanumeric.
   *
   * <p>Accepts raw or formatted input but rejects unexpected characters.
   */
  public static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String cnpj = normalize(value);

    if (!NORMALIZED_SHAPE.matcher(cnpj).matches()) {
      return false;
    }

    int firstDigit = calculateCheckDigit(cnpj.substring(0, 12));
    if (firstDigit != (cnpj.charAt(12) - '0')) {
      return false;
    }

    int secondDigit = calculateCheckDigit(cnpj.substring(0, 13));

    return secondDigit == (cnpj.charAt(13) - '0');
  }

  /**
   * Returns value as XX.XXX.XXX/XXXX-XX.
   *
   * <p>If the normalized value has an invalid length, value is returned unchanged.
   */
  public static String format(String value) {
    String cnpj = normalize(value);

    if (cnpj.length() != 14) {
      return value;
    }

    return cnpj.substring(0, 2) + "." + cnpj.substring(2, 5) + "." + cnpj.substring(5, 8) + "/"
        + cnpj.substring(8, 12) + "-" + cnpj.substring(12, 14);
  }
}
