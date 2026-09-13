using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// AC: verified against the official SEFAZ-AC "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AC.html),
    /// including its worked example (01.004.823/001-12). Format: 11 digits
    /// (always starting with "01") + 2 check digits.
    /// </summary>
    internal static class Ac
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

            if (v.Length != 13 || !v.StartsWith("01"))
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

            return $"{v.Substring(0, 2)}.{v.Substring(2, 3)}.{v.Substring(5, 3)}/{v.Substring(8, 3)}-{v.Substring(11, 2)}";
        }
    }
}
