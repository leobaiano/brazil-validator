using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// MA: verified against the official SEFAZ-MA "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_MA.html),
    /// including its worked example (120000385).
    ///
    /// Format: "12" (fixed) + 6 sequence digits + 1 check digit = 9 digits
    /// total. No official punctuation mask is published, so Format returns
    /// plain digits.
    /// </summary>
    internal static class Ma
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 9 || !v.StartsWith("12"))
            {
                return false;
            }

            return Mod11.Mod11CheckDigit(Mod11.WeightedSum(v, Weights)) == (v[8] - '0');
        }

        public static string Format(string value) => Normalize(value);
    }
}
