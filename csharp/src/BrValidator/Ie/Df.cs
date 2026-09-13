using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// DF: SEFAZ-DF's own Sintegra "Roteiro de Crítica" page
    /// (sintegra.gov.br/Cad_Estados/cad_DF.html) is empty, so this was
    /// instead cross-verified against two independent secondary sources
    /// that agree with each other (cadcobol.com.br's fully worked example,
    /// arithmetic re-checked by hand, and mestredocalculo.com.br
    /// independently citing the same valid example "07.300.001.001-09").
    /// The algorithm is structurally identical to AC's officially-confirmed
    /// one (same weight sequences), differing only in the fixed "07" prefix
    /// -- strong evidence both derive from the same original SEFAZ
    /// documentation.
    ///
    /// Format: "07" (fixed) + 6 sequence digits + 3 "ordem do
    /// estabelecimento" digits (001 = matriz) + 2 check digits = 13 digits
    /// total.
    /// </summary>
    internal static class Df
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d./\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] FirstDigitWeights = { 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        private static readonly int[] SecondDigitWeights = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 13 || !v.StartsWith("07"))
            {
                return false;
            }

            int firstDigit = Mod11.Mod11CheckDigit(Mod11.WeightedSum(v, FirstDigitWeights));
            if (firstDigit != (v[11] - '0'))
            {
                return false;
            }

            int secondDigit = Mod11.Mod11CheckDigit(Mod11.WeightedSum(v, SecondDigitWeights));

            return secondDigit == (v[12] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 13)
            {
                return value;
            }

            return $"{v.Substring(0, 2)}.{v.Substring(2, 3)}.{v.Substring(5, 3)}.{v.Substring(8, 3)}-{v.Substring(11, 2)}";
        }
    }
}
