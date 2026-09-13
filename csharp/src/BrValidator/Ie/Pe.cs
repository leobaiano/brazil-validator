using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// PE: verified against the official SEFAZ-PE "Roteiro de Crítica da
    /// Inscrição Estadual" for the e-Fisco system
    /// (sintegra.gov.br/Cad_Estados/cad_PE.html), including its fully
    /// worked example (0321418-40). Format: 7 digits + 2 check digits.
    /// </summary>
    internal static class Pe
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] FirstDigitWeights = { 8, 7, 6, 5, 4, 3, 2 };
        private static readonly int[] SecondDigitWeights = { 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 9)
            {
                return false;
            }

            string baseDigits = v.Substring(0, 7);
            int firstDigit = Mod11.Mod11CheckDigit(Mod11.WeightedSum(baseDigits, FirstDigitWeights));

            if (firstDigit != (v[7] - '0'))
            {
                return false;
            }

            int secondDigit = Mod11.Mod11CheckDigit(
                Mod11.WeightedSum(baseDigits + firstDigit, SecondDigitWeights));

            return secondDigit == (v[8] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 9)
            {
                return value;
            }

            return $"{v.Substring(0, 7)}-{v.Substring(7, 2)}";
        }
    }
}
