using System.Collections.Generic;
using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// AL: verified against the official SEFAZ-AL "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AL.html),
    /// including its worked example (24000004 -&gt; check digit 8, i.e.
    /// 240000048).
    ///
    /// Format: "24" (fixed) + 1 "tipo de empresa" digit (0,3,5,7,8) + 5
    /// sequence digits + 1 check digit = 9 digits total. No official
    /// punctuation mask is published, so Format returns the plain digits.
    /// </summary>
    internal static class Al
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 9, 8, 7, 6, 5, 4, 3, 2 };
        private static readonly HashSet<char> ValidTypeDigits = new HashSet<char> { '0', '3', '5', '7', '8' };

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

            if (!ValidTypeDigits.Contains(v[2]))
            {
                return false;
            }

            int checkDigit = Mod11.Mod11TimesTenCheckDigit(Mod11.WeightedSum(v, Weights));

            return checkDigit == (v[8] - '0');
        }

        public static string Format(string value) => Normalize(value);
    }
}
