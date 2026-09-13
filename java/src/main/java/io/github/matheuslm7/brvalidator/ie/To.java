package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * TO: verified against the official SEFAZ-TO "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_TO.html), including its worked example (29010227836).
 * Format: 11 digits, where positions 3-4 hold a fixed "tipo" code (01 Produtor Rural, 02
 * Indústria e Comércio, 03 Empresas Rudimentares, 99 Cadastro Antigo) that is excluded from the
 * check-digit calculation, and position 11 is the check digit.
 */
final class To {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\s]+$");
  private static final int[] WEIGHTS = {9, 8, 7, 6, 5, 4, 3, 2};
  private static final Set<String> VALID_TYPE_CODES = Set.of("01", "02", "03", "99");
  // 1-based positions used in the check-digit calculation (positions 3-4 are skipped).
  private static final int[] DIGIT_POSITIONS = {1, 2, 5, 6, 7, 8, 9, 10};

  private To() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 11 || !VALID_TYPE_CODES.contains(v.substring(2, 4))) {
      return false;
    }

    int sum = 0;
    for (int i = 0; i < DIGIT_POSITIONS.length; i++) {
      sum += (v.charAt(DIGIT_POSITIONS[i] - 1) - '0') * WEIGHTS[i];
    }

    return Mod11.mod11CheckDigit(sum) == (v.charAt(10) - '0');
  }

  static String format(String value) {
    return normalize(value);
  }
}
