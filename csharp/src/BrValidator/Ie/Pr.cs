using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// PR: verified against the official SEFAZ-PR "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_PR.html),
    /// including its fully worked example (123.45678-50), and cross-checked
    /// against the reference Visual Basic routine published on the same
    /// page. Format: 8 digits + 2 check digits.
    /// </summary>
    internal static class Pr
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d.\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] FirstDigitWeights = { 3, 2, 7, 6, 5, 4, 3, 2 };
        private static readonly int[] SecondDigitWeights = { 4, 3, 2, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 10)
            {
                return false;
            }

            string baseDigits = v.Substring(0, 8);
            int firstDigit = Mod11.Mod11CheckDigit(Mod11.WeightedSum(baseDigits, FirstDigitWeights));

            if (firstDigit != (v[8] - '0'))
            {
                return false;
            }

            int secondDigit = Mod11.Mod11CheckDigit(
                Mod11.WeightedSum(baseDigits + firstDigit, SecondDigitWeights));

            return secondDigit == (v[9] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 10)
            {
                return value;
            }

            return $"{v.Substring(0, 3)}.{v.Substring(3, 5)}-{v.Substring(8, 2)}";
        }
    }
}
