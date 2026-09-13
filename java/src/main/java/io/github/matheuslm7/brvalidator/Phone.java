package io.github.matheuslm7.brvalidator;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/** Validates, normalizes, and formats Brazilian national phone numbers (no +55 country code). */
public final class Phone {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\s()-]+$");

  private Phone() {}

  /** Strips formatting and returns the canonical (digits-only) representation of value. */
  public static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  /**
   * Returns true if value is a structurally valid Brazilian phone number.
   *
   * <p>Enforces Anatel's numbering plan: the DDD must be one of the 67 codes actually assigned,
   * mobile numbers (11 digits) must carry the "ninth digit" 9 (Resolução nº 553/2010), and
   * landline numbers (10 digits) must start with 2-5.
   */
  public static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String phone = normalize(value);

    if (phone.length() != 10 && phone.length() != 11) {
      return false;
    }

    String ddd = phone.substring(0, 2);

    if (!Shared.VALID_DDDS.contains(ddd)) {
      return false;
    }

    char subscriberFirstDigit = phone.charAt(2);

    if (phone.length() == 11) {
      return subscriberFirstDigit == '9';
    }

    return "2345".indexOf(subscriberFirstDigit) >= 0;
  }

  /**
   * Returns value as (XX) XXXXX-XXXX (mobile) or (XX) XXXX-XXXX (landline).
   *
   * <p>If the normalized value has an invalid length, value is returned unchanged.
   */
  public static String format(String value) {
    String phone = normalize(value);

    if (phone.length() == 11) {
      return "(" + phone.substring(0, 2) + ") " + phone.substring(2, 7) + "-"
          + phone.substring(7, 11);
    }

    if (phone.length() == 10) {
      return "(" + phone.substring(0, 2) + ") " + phone.substring(2, 6) + "-"
          + phone.substring(6, 10);
    }

    return value;
  }
}
