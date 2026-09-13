package io.github.matheuslm7.brvalidator.ie;

import java.util.Map;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/**
 * Validates, normalizes, and formats Brazilian Inscrição Estadual numbers.
 *
 * <p>Inscrição Estadual has no single national rule: each state (SEFAZ) defines its own digit
 * count and check-digit algorithm, so every UF is modeled as its own package-private class in
 * this package and registered in the {@code STATES} map below. A UF absent from that map is
 * simply not supported yet.
 */
public final class Ie {

  private static final class StateValidator {
    final Predicate<String> isValid;
    final UnaryOperator<String> normalize;
    final UnaryOperator<String> format;

    StateValidator(Predicate<String> isValid, UnaryOperator<String> normalize,
        UnaryOperator<String> format) {
      this.isValid = isValid;
      this.normalize = normalize;
      this.format = format;
    }
  }

  private static final Map<String, StateValidator> STATES = Map.ofEntries(
      Map.entry("AC", new StateValidator(Ac::isValid, Ac::normalize, Ac::format)),
      Map.entry("AL", new StateValidator(Al::isValid, Al::normalize, Al::format)),
      Map.entry("AM", new StateValidator(Am::isValid, Am::normalize, Am::format)),
      Map.entry("AP", new StateValidator(Ap::isValid, Ap::normalize, Ap::format)),
      Map.entry("BA", new StateValidator(Ba::isValid, Ba::normalize, Ba::format)),
      Map.entry("CE", new StateValidator(Ce::isValid, Ce::normalize, Ce::format)),
      Map.entry("DF", new StateValidator(Df::isValid, Df::normalize, Df::format)),
      Map.entry("ES", new StateValidator(Es::isValid, Es::normalize, Es::format)),
      Map.entry("GO", new StateValidator(Go::isValid, Go::normalize, Go::format)),
      Map.entry("MA", new StateValidator(Ma::isValid, Ma::normalize, Ma::format)),
      Map.entry("MG", new StateValidator(Mg::isValid, Mg::normalize, Mg::format)),
      Map.entry("MS", new StateValidator(Ms::isValid, Ms::normalize, Ms::format)),
      Map.entry("MT", new StateValidator(Mt::isValid, Mt::normalize, Mt::format)),
      Map.entry("PA", new StateValidator(Pa::isValid, Pa::normalize, Pa::format)),
      Map.entry("PB", new StateValidator(Pb::isValid, Pb::normalize, Pb::format)),
      Map.entry("PE", new StateValidator(Pe::isValid, Pe::normalize, Pe::format)),
      Map.entry("PI", new StateValidator(Pi::isValid, Pi::normalize, Pi::format)),
      Map.entry("PR", new StateValidator(Pr::isValid, Pr::normalize, Pr::format)),
      Map.entry("RJ", new StateValidator(Rj::isValid, Rj::normalize, Rj::format)),
      Map.entry("RN", new StateValidator(Rn::isValid, Rn::normalize, Rn::format)),
      Map.entry("RO", new StateValidator(Ro::isValid, Ro::normalize, Ro::format)),
      Map.entry("RR", new StateValidator(Rr::isValid, Rr::normalize, Rr::format)),
      Map.entry("RS", new StateValidator(Rs::isValid, Rs::normalize, Rs::format)),
      Map.entry("SC", new StateValidator(Sc::isValid, Sc::normalize, Sc::format)),
      Map.entry("SE", new StateValidator(Se::isValid, Se::normalize, Se::format)),
      Map.entry("SP", new StateValidator(Sp::isValid, Sp::normalize, Sp::format)),
      Map.entry("TO", new StateValidator(To::isValid, To::normalize, To::format))
  );

  private Ie() {}

  private static StateValidator resolveState(String uf) {
    return STATES.get(uf.trim().toUpperCase());
  }

  /** Returns true if value is a valid Inscrição Estadual for uf. */
  public static boolean isValid(String value, String uf) {
    StateValidator state = resolveState(uf);

    if (state == null) {
      return false;
    }

    return state.isValid.test(value);
  }

  /**
   * Strips formatting and returns the canonical representation of value for uf.
   *
   * <p>If uf is not supported, value is returned unchanged.
   */
  public static String normalize(String value, String uf) {
    StateValidator state = resolveState(uf);

    if (state == null) {
      return value;
    }

    return state.normalize.apply(value);
  }

  /**
   * Returns value in uf's standard human-readable representation.
   *
   * <p>If uf is not supported or the normalized value has an invalid length, value is returned
   * unchanged.
   */
  public static String format(String value, String uf) {
    StateValidator state = resolveState(uf);

    if (state == null) {
      return value;
    }

    return state.format.apply(value);
  }
}
