using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator
{
    /// <summary>Validates, normalizes, and formats Brazilian CEP (postal) codes.</summary>
    public static class Cep
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d-]+$", RegexOptions.Compiled);

        /// <summary>
        /// Strips formatting and returns the canonical (digits-only)
        /// representation of value.
        /// </summary>
        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        /// <summary>
        /// Returns true if value is a structurally valid CEP. A CEP has no
        /// check digit -- it is an 8-digit postal routing code (region,
        /// sub-region, sector, subsector and distribution suffix) defined by
        /// Correios -- so validity here means structural correctness (8
        /// digits), not whether the code exists in Correios' address
        /// database.
        /// </summary>
        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            return Normalize(value).Length == 8;
        }

        /// <summary>
        /// Returns value as XXXXX-XXX. If the normalized value has an
        /// invalid length, value is returned unchanged.
        /// </summary>
        public static string Format(string value)
        {
            string cep = Normalize(value);

            if (cep.Length != 8)
            {
                return value;
            }

            return $"{cep.Substring(0, 5)}-{cep.Substring(5, 3)}";
        }
    }
}
