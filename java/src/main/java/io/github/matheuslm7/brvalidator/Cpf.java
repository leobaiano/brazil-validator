package io.github.matheuslm7.brvalidator;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/** Validates, normalizes, and formats Brazilian CPF numbers. */
public final class Cpf {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d.\\-\\s]+$");

  private Cpf() {}

  /** Strips formatting and returns the canonical (digits-only) representation of value. */
  public static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static boolean isAllSameDigit(String value) {
    for (int i = 1; i < value.length(); i++) {
      if (value.charAt(i) != value.charAt(0)) {
        return false;
      }
    }
    return true;
  }

  private static int calculateCheckDigit(String cpf, int weight) {
    int sum = 0;

    for (int i = 0; i < cpf.length(); i++) {
      sum += (cpf.charAt(i) - '0') * (weight - i);
    }

    int remainder = (sum * 10) % 11;

    if (remainder == 10) {
      remainder = 0;
    }

    return remainder;
  }

  /**
   * Returns true if value is a structurally and check-digit valid CPF.
   *
   * <p>Accepts raw or formatted input but rejects unexpected characters.
   */
  public static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String cpf = normalize(value);

    if (cpf.length() != 11) {
      return false;
    }

    if (isAllSameDigit(cpf)) {
      return false;
    }

    int firstDigit = calculateCheckDigit(cpf.substring(0, 9), 10);
    if (firstDigit != (cpf.charAt(9) - '0')) {
      return false;
    }

    int secondDigit = calculateCheckDigit(cpf.substring(0, 10), 11);

    return secondDigit == (cpf.charAt(10) - '0');
  }

  /**
   * Returns value as XXX.XXX.XXX-XX.
   *
   * <p>If the normalized value has an invalid length, value is returned unchanged.
   */
  public static String format(String value) {
    String cpf = normalize(value);

    if (cpf.length() != 11) {
      return value;
    }

    return cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-"
        + cpf.substring(9, 11);
  }
}
