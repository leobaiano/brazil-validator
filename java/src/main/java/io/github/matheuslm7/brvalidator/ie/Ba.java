package io.github.matheuslm7.brvalidator.ie;

import io.github.matheuslm7.brvalidator.internal.Shared;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * BA: verified against the official SEFAZ-BA "Roteiro de Crítica da Inscrição Estadual"
 * (sintegra.gov.br/Cad_Estados/cad_BA.html), including its four worked examples (123456-63,
 * 612345-57, 1000003-06 mod-10/mod-11 x 8/9-digit variants).
 *
 * <p>Bahia has two lengths (8 or 9 digits) and, within each, two moduli: módulo 10 when the
 * discriminating digit (the 1st digit for 8-digit IEs, the 2nd for 9-digit IEs) is one of
 * 0,1,2,3,4,5,8, and módulo 11 when it is 6, 7 or 9. The last check digit is calculated first
 * (from the base digits alone), then the first check digit is calculated from the base plus that
 * digit.
 */
final class Ba {

  private static final Pattern ALLOWED_CHARS = Pattern.compile("^[\\d\\-\\s]+$");
  private static final Set<Character> MOD10_DIGITS = Set.of('0', '1', '2', '3', '4', '5', '8');
  private static final Set<Character> MOD11_DIGITS = Set.of('6', '7', '9');

  private Ba() {}

  static String normalize(String value) {
    return Shared.removeNonDigits(value);
  }

  private static int checkDigitFor(int sum, boolean useMod11) {
    return useMod11 ? Mod11.mod11CheckDigit(sum) : Mod11.mod10CheckDigit(sum);
  }

  private static int[] descendingWeights(int length) {
    int[] weights = new int[length];
    for (int i = 0; i < length; i++) {
      weights[i] = length + 1 - i;
    }
    return weights;
  }

  static boolean isValid(String value) {
    if (!ALLOWED_CHARS.matcher(value).matches()) {
      return false;
    }

    String v = normalize(value);

    if (v.length() != 8 && v.length() != 9) {
      return false;
    }

    char discriminant = v.length() == 8 ? v.charAt(0) : v.charAt(1);
    boolean useMod11 = MOD11_DIGITS.contains(discriminant);

    if (!useMod11 && !MOD10_DIGITS.contains(discriminant)) {
      return false;
    }

    int baseLength = v.length() - 2;
    String base = v.substring(0, baseLength);
    int lastDigit = checkDigitFor(Mod11.weightedSum(base, descendingWeights(baseLength)), useMod11);

    if (lastDigit != (v.charAt(v.length() - 1) - '0')) {
      return false;
    }

    String baseWithLastDigit = base + lastDigit;
    int firstDigit = checkDigitFor(
        Mod11.weightedSum(baseWithLastDigit, descendingWeights(baseLength + 1)), useMod11);

    return firstDigit == (v.charAt(v.length() - 2) - '0');
  }

  static String format(String value) {
    String v = normalize(value);

    if (v.length() != 8 && v.length() != 9) {
      return value;
    }

    return v.substring(0, v.length() - 2) + "-" + v.substring(v.length() - 2);
  }
}
