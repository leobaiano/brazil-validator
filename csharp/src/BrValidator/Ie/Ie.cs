using System;
using System.Collections.Generic;

namespace BrValidator.Ie
{
    /// <summary>
    /// Validates, normalizes, and formats Brazilian Inscrição Estadual
    /// numbers.
    ///
    /// Inscrição Estadual has no single national rule: each state (SEFAZ)
    /// defines its own digit count and check-digit algorithm, so every UF is
    /// modeled as its own internal class in this namespace and registered
    /// in the States map below. A UF absent from that map is simply not
    /// supported yet.
    /// </summary>
    public static class Ie
    {
        private class StateValidator
        {
            public Func<string, bool> IsValid { get; }
            public Func<string, string> Normalize { get; }
            public Func<string, string> Format { get; }

            public StateValidator(Func<string, bool> isValid, Func<string, string> normalize,
                Func<string, string> format)
            {
                IsValid = isValid;
                Normalize = normalize;
                Format = format;
            }
        }

        private static readonly Dictionary<string, StateValidator> States = new Dictionary<string, StateValidator>
        {
            { "AC", new StateValidator(Ac.IsValid, Ac.Normalize, Ac.Format) },
            { "AL", new StateValidator(Al.IsValid, Al.Normalize, Al.Format) },
            { "AM", new StateValidator(Am.IsValid, Am.Normalize, Am.Format) },
            { "AP", new StateValidator(Ap.IsValid, Ap.Normalize, Ap.Format) },
            { "BA", new StateValidator(Ba.IsValid, Ba.Normalize, Ba.Format) },
            { "CE", new StateValidator(Ce.IsValid, Ce.Normalize, Ce.Format) },
            { "DF", new StateValidator(Df.IsValid, Df.Normalize, Df.Format) },
            { "ES", new StateValidator(Es.IsValid, Es.Normalize, Es.Format) },
            { "GO", new StateValidator(Go.IsValid, Go.Normalize, Go.Format) },
            { "MA", new StateValidator(Ma.IsValid, Ma.Normalize, Ma.Format) },
            { "MG", new StateValidator(Mg.IsValid, Mg.Normalize, Mg.Format) },
            { "MS", new StateValidator(Ms.IsValid, Ms.Normalize, Ms.Format) },
            { "MT", new StateValidator(Mt.IsValid, Mt.Normalize, Mt.Format) },
            { "PA", new StateValidator(Pa.IsValid, Pa.Normalize, Pa.Format) },
            { "PB", new StateValidator(Pb.IsValid, Pb.Normalize, Pb.Format) },
            { "PE", new StateValidator(Pe.IsValid, Pe.Normalize, Pe.Format) },
            { "PI", new StateValidator(Pi.IsValid, Pi.Normalize, Pi.Format) },
            { "PR", new StateValidator(Pr.IsValid, Pr.Normalize, Pr.Format) },
            { "RJ", new StateValidator(Rj.IsValid, Rj.Normalize, Rj.Format) },
            { "RN", new StateValidator(Rn.IsValid, Rn.Normalize, Rn.Format) },
            { "RO", new StateValidator(Ro.IsValid, Ro.Normalize, Ro.Format) },
            { "RR", new StateValidator(Rr.IsValid, Rr.Normalize, Rr.Format) },
            { "RS", new StateValidator(Rs.IsValid, Rs.Normalize, Rs.Format) },
            { "SC", new StateValidator(Sc.IsValid, Sc.Normalize, Sc.Format) },
            { "SE", new StateValidator(Se.IsValid, Se.Normalize, Se.Format) },
            { "SP", new StateValidator(Sp.IsValid, Sp.Normalize, Sp.Format) },
            { "TO", new StateValidator(To.IsValid, To.Normalize, To.Format) },
        };

        private static StateValidator ResolveState(string uf)
        {
            States.TryGetValue(uf.Trim().ToUpperInvariant(), out StateValidator state);
            return state;
        }

        /// <summary>Returns true if value is a valid Inscrição Estadual for uf.</summary>
        public static bool IsValid(string value, string uf)
        {
            StateValidator state = ResolveState(uf);

            return state != null && state.IsValid(value);
        }

        /// <summary>
        /// Strips formatting and returns the canonical representation of
        /// value for uf. If uf is not supported, value is returned
        /// unchanged.
        /// </summary>
        public static string Normalize(string value, string uf)
        {
            StateValidator state = ResolveState(uf);

            return state == null ? value : state.Normalize(value);
        }

        /// <summary>
        /// Returns value in uf's standard human-readable representation. If
        /// uf is not supported or the normalized value has an invalid
        /// length, value is returned unchanged.
        /// </summary>
        public static string Format(string value, string uf)
        {
            StateValidator state = ResolveState(uf);

            return state == null ? value : state.Format(value);
        }
    }
}
