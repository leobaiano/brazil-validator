package io.github.matheuslm7.brvalidator;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/** Validates, normalizes, and formats Brazilian CEP (postal) codes. */
public final class Cep {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d-]+$");

  private Cep() {}

  /** Strips formatting and returns the canonical (digits-only) representation of value. */
  public static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  /**
   * Returns true if value is a structurally valid CEP.
   *
   * <p>A CEP has no check digit -- it is an 8-digit postal routing code (region, sub-region,
   * sector, subsector and distribution suffix) defined by Correios -- so validity here means
   * structural correctness (8 digits), not whether the code exists in Correios' address
   * database.
   */
  public static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    return normalize(value).length() == 8;
  }

  /**
   * Returns value as XXXXX-XXX.
   *
   * <p>If the normalized value has an invalid length, value is returned unchanged.
   */
  public static String format(String value) {
    String cep = normalize(value);

    if (cep.length() != 8) {
      return value;
    }

    return cep.substring(0, 5) + "-" + cep.substring(5, 8);
  }
}
