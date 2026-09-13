using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// RR: verified against the official SEFAZ-RR "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RR.html),
    /// including its worked example (24006153-6) and the ten additional
    /// valid numbers it lists. Format: "24" (fixed) + 6 sequence digits + 1
    /// check digit = 9 digits total. Unlike every other state, the check
    /// digit uses módulo 9, and the weights are the digit's own 1-based
    /// position (ascending, not descending).
    /// </summary>
    internal static class Rr
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 1, 2, 3, 4, 5, 6, 7, 8 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 9 || !v.StartsWith("24"))
            {
                return false;
            }

            int checkDigit = Mod11.WeightedSum(v, Weights) % 9;

            return checkDigit == (v[8] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 9)
            {
                return value;
            }

            return $"{v.Substring(0, 8)}-{v.Substring(8, 1)}";
        }
    }
}
