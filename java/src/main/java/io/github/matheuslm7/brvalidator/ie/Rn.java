package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.regex.Pattern;

/**
 * RN: verified against the official SEFAZ-RN "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_RN.html), including both of its worked examples
 * (20.040.040-1 and 20.0.040.040-0). Format: always starts with "20", followed by either 7 or 8
 * more digits, plus 1 check digit (9 or 10 digits total, both still valid today per the official
 * page).
 */
final class Rn {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d.\\-\\s]+$");

  private Rn() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static int[] weightsFor(int baseLength) {
    int[] weights = new int[baseLength];
    for (int i = 0; i < baseLength; i++) {
      weights[i] = baseLength + 1 - i;
    }
    return weights;
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if ((v.length() != 9 && v.length() != 10) || !v.startsWith("20")) {
      return false;
    }

    String base = v.substring(0, v.length() - 1);
    int checkDigit =
        Mod11.mod11TimesTenCheckDigit(Mod11.weightedSum(base, weightsFor(base.length())));

    return checkDigit == (v.charAt(v.length() - 1) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() == 9) {
      return v.substring(0, 2) + "." + v.substring(2, 5) + "." + v.substring(5, 8) + "-"
          + v.substring(8, 9);
    }

    if (v.length() == 10) {
      return v.substring(0, 2) + "." + v.substring(2, 3) + "." + v.substring(3, 6) + "."
          + v.substring(6, 9) + "-" + v.substring(9, 10);
    }

    return value;
  }
}
