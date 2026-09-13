package io.github.matheuslm7.brvalidator;

import java.util.regex.Pattern;

/** Validates, normalizes, and formats e-mail addresses. */
public final class Email {

  // Sourced from the WHATWG HTML Living Standard's email state regex (used by browsers to
  // validate <input type="email">). All quantifiers are bounded, so it cannot suffer
  // catastrophic backtracking.
  private static final Pattern EMAIL_REGEX = Pattern.compile(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"
          + "(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$");

  private static final int MAX_EMAIL_LENGTH = 254;
  private static final int MAX_LOCAL_PART_LENGTH = 64;

  private Email() {}

  /** Trims whitespace and lowercases value. */
  public static String normalize(String value) {
    return value.trim().toLowerCase();
  }

  /**
   * Returns true if value is a structurally valid e-mail address, per the WHATWG regular
   * expression plus RFC 5321 length limits.
   */
  public static boolean isValid(String value) {
    String email = normalize(value);

    if (email.isEmpty() || email.length() > MAX_EMAIL_LENGTH) {
      return false;
    }

    int atIndex = email.indexOf('@');
    String localPart = atIndex >= 0 ? email.substring(0, atIndex) : email;

    if (localPart.isEmpty() || localPart.length() > MAX_LOCAL_PART_LENGTH) {
      return false;
    }

    return EMAIL_REGEX.matcher(email).matches();
  }

  /**
   * Returns the same canonical value as {@link #normalize(String)}.
   *
   * <p>Unlike CPF/CNPJ/CEP/Phone, an e-mail address has no visual mask to apply.
   */
  public static String format(String value) {
    return normalize(value);
  }
}
