package io.github.matheuslm7.brvalidator;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/** Validates, normalizes, and formats PIX keys (CPF, CNPJ, e-mail, phone, or random key). */
public final class Pix {

  // Formats verified against Bacen's official DICT schema (github.com/bacen/pix-dict-api
  // openapi.yaml) and the Manual de Padrões para Iniciação do Pix:
  // - CPF/CNPJ keys are digits-only (^[0-9]{11}$ / ^[0-9]{14}$). The DICT schema does not yet
  //   accept alphanumeric CNPJ as a key.
  // - The EVP (random key) is a canonical, case-insensitive UUID (8-4-4-4-12).
  // - Phone keys use the international format "+55AANNNNNNNNN", where AA is the DDD and
  //   NNNNNNNNN is a 9-digit mobile number -- Brazilian Pix only registers Brazilian mobile
  //   numbers, so the country code is fixed at 55.
  // - Email keys are case-insensitive and capped at 77 characters.
  private static final Pattern EVP_REGEX = Pattern.compile(
      "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
      Pattern.CASE_INSENSITIVE);
  private static final Pattern CPF_SHAPE = Pattern.compile("^\\d{11}$");
  private static final Pattern CNPJ_SHAPE = Pattern.compile("^\\d{14}$");
  private static final Pattern PHONE_CHARS = Pattern.compile("^[\\d\\s()+-]+$");
  private static final Pattern PHONE_KEY_FORM = Pattern.compile("^\\+55\\d{11}$");

  private static final int MAX_EMAIL_KEY_LENGTH = 77;

  private Pix() {}

  /** Detects which kind of PIX key value looks like, or null if it matches none. */
  public static PixKeyType getKeyType(String value) {
    String trimmed = value.trim();

    if (EVP_REGEX.matcher(trimmed).matches()) {
      return PixKeyType.EVP;
    }

    if (trimmed.contains("@")) {
      return PixKeyType.EMAIL;
    }

    if (trimmed.startsWith("+")) {
      return PixKeyType.PHONE;
    }

    if (CPF_SHAPE.matcher(trimmed).matches()) {
      return PixKeyType.CPF;
    }

    if (CNPJ_SHAPE.matcher(trimmed).matches()) {
      return PixKeyType.CNPJ;
    }

    return null;
  }

  private static String normalizePhoneKey(String value) {
    return "+" + Shared.removeNonDigits(value);
  }

  private static boolean isValidPhoneKey(String value) {
    if (!PHONE_CHARS.matcher(value).matches()) {
      return false;
    }

    String phone = normalizePhoneKey(value);

    if (!PHONE_KEY_FORM.matcher(phone).matches()) {
      return false;
    }

    String ddd = phone.substring(3, 5);
    char subscriberFirstDigit = phone.charAt(5);

    return Shared.VALID_DDDS.contains(ddd) && subscriberFirstDigit == '9';
  }

  private static String formatPhoneKey(String value) {
    String phone = normalizePhoneKey(value);

    if (!PHONE_KEY_FORM.matcher(phone).matches()) {
      return value;
    }

    return "+55 " + Phone.format(phone.substring(3));
  }

  /** Returns true if value is a valid PIX key of any recognized type. */
  public static boolean isValid(String value) {
    PixKeyType keyType = getKeyType(value);

    if (keyType == null) {
      return false;
    }

    String trimmed = value.trim();

    switch (keyType) {
      case CPF:
        return Cpf.isValid(trimmed);
      case CNPJ:
        return Cnpj.isValid(trimmed);
      case EMAIL:
        return trimmed.length() <= MAX_EMAIL_KEY_LENGTH && Email.isValid(trimmed);
      case PHONE:
        return isValidPhoneKey(trimmed);
      case EVP:
        return true;
      default:
        return false;
    }
  }

  /**
   * Dispatches to the canonical normalize rule of value's detected key type.
   *
   * <p>If the type cannot be detected, value is returned unchanged.
   */
  public static String normalize(String value) {
    PixKeyType keyType = getKeyType(value);

    if (keyType == null) {
      return value;
    }

    String trimmed = value.trim();

    switch (keyType) {
      case CPF:
        return Cpf.normalize(trimmed);
      case CNPJ:
        return Cnpj.normalize(trimmed);
      case EMAIL:
        return Email.normalize(trimmed);
      case PHONE:
        return normalizePhoneKey(trimmed);
      case EVP:
        return trimmed.toLowerCase();
      default:
        return value;
    }
  }

  /**
   * Dispatches to the canonical format rule of value's detected key type.
   *
   * <p>If the type cannot be detected, value is returned unchanged.
   */
  public static String format(String value) {
    PixKeyType keyType = getKeyType(value);

    if (keyType == null) {
      return value;
    }

    String trimmed = value.trim();

    switch (keyType) {
      case CPF:
        return Cpf.format(trimmed);
      case CNPJ:
        return Cnpj.format(trimmed);
      case EMAIL:
        return Email.format(trimmed);
      case PHONE:
        return formatPhoneKey(trimmed);
      case EVP:
        return trimmed.toLowerCase();
      default:
        return value;
    }
  }
}
