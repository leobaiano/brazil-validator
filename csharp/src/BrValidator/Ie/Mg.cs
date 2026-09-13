using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// MG: verified against the official SEFAZ-MG "Roteiro de Crítica da
    /// Inscrição Estadual" (mirrored at
    /// sintegra.gov.br/Cad_Estados/cad_MG.html), including its fully worked
    /// example (062.307.904/0081).
    ///
    /// Format: A1A2A3 B1B2B3B4B5B6 C1C2 D1D2 (13 digits), where A =
    /// município code, B = registration number, C = establishment order, D
    /// = check digits.
    /// </summary>
    internal static class Mg
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d./\s]+$", RegexOptions.Compiled);
        private static readonly int[] FirstDigitWeights = { 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2 };
        private static readonly int[] SecondDigitWeights = { 3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static int SumOfDigits(int value)
        {
            int sum = 0;
            foreach (char c in value.ToString())
            {
                sum += c - '0';
            }
            return sum;
        }

        // D1 equalizes the field widths by inserting a "0" right after the
        // município code, then sums the *digits* of each weighted product
        // (not the products themselves) before completing to the next
        // multiple of ten.
        private static int CalculateFirstDigit(string baseDigits)
        {
            string withInsertedZero = baseDigits.Substring(0, 3) + "0" + baseDigits.Substring(3);

            int digitSum = 0;
            for (int i = 0; i < FirstDigitWeights.Length; i++)
            {
                digitSum += SumOfDigits((withInsertedZero[i] - '0') * FirstDigitWeights[i]);
            }

            int remainder = digitSum % 10;

            return remainder == 0 ? 0 : 10 - remainder;
        }

        // D2 uses the original (un-padded) base plus D1, and sums the
        // weighted products directly, following the general módulo 11
        // remainder rule.
        private static int CalculateSecondDigit(string baseDigits, int firstDigit)
        {
            string withFirstDigit = baseDigits + firstDigit;

            int sum = Mod11.WeightedSum(withFirstDigit, SecondDigitWeights);
            int remainder = sum % 11;

            return remainder <= 1 ? 0 : 11 - remainder;
        }

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 13)
            {
                return false;
            }

            string baseDigits = v.Substring(0, 11);
            int firstDigit = CalculateFirstDigit(baseDigits);

            if (firstDigit != (v[11] - '0'))
            {
                return false;
            }

            int secondDigit = CalculateSecondDigit(baseDigits, firstDigit);

            return secondDigit == (v[12] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 13)
            {
                return value;
            }

            return $"{v.Substring(0, 3)}.{v.Substring(3, 3)}.{v.Substring(6, 3)}/{v.Substring(9, 4)}";
        }
    }
}
