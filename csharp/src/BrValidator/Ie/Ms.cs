using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// MS: verified against the official SEFAZ-MS "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_MS.html) for the
    /// algorithm (which the page does not accompany with a worked numeric
    /// example), plus an independently hand-computed regression vector
    /// (281234566). Format: 8 digits (always starting with "28" or "50") +
    /// 1 check digit.
    /// </summary>
    internal static class Ms
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static bool HasValidPrefix(string v)
        {
            string prefix = v.Substring(0, 2);
            return prefix == "28" || prefix == "50";
        }

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 9 || !HasValidPrefix(v))
            {
                return false;
            }

            return Mod11.Mod11CheckDigit(Mod11.WeightedSum(v, Weights)) == (v[8] - '0');
        }

        public static string Format(string value) => Normalize(value);
    }
}
