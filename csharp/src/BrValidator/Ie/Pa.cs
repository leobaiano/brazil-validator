using System.Collections.Generic;
using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// PA: verified against the official SEFAZ-PA "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_PA.html),
    /// including its two worked examples (15999999-5, 75000002-3). Format:
    /// 8 digits (always starting with 15, 75, 76, 77, 78 or 79) + 1 check
    /// digit.
    /// </summary>
    internal static class Pa
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 9, 8, 7, 6, 5, 4, 3, 2 };
        private static readonly HashSet<string> ValidPrefixes =
            new HashSet<string> { "15", "75", "76", "77", "78", "79" };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 9 || !ValidPrefixes.Contains(v.Substring(0, 2)))
            {
                return false;
            }

            return Mod11.Mod11CheckDigit(Mod11.WeightedSum(v, Weights)) == (v[8] - '0');
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
