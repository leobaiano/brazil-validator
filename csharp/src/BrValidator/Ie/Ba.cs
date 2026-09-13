using System.Collections.Generic;
using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// BA: verified against the official SEFAZ-BA "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_BA.html),
    /// including its four worked examples (123456-63, 612345-57,
    /// 1000003-06 mod-10/mod-11 x 8/9-digit variants).
    ///
    /// Bahia has two lengths (8 or 9 digits) and, within each, two moduli:
    /// módulo 10 when the discriminating digit (the 1st digit for 8-digit
    /// IEs, the 2nd for 9-digit IEs) is one of 0,1,2,3,4,5,8, and módulo 11
    /// when it is 6, 7 or 9. The last check digit is calculated first (from
    /// the base digits alone), then the first check digit is calculated
    /// from the base plus that digit.
    /// </summary>
    internal static class Ba
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\-\s]+$", RegexOptions.Compiled);
        private static readonly HashSet<char> Mod10Digits = new HashSet<char> { '0', '1', '2', '3', '4', '5', '8' };
        private static readonly HashSet<char> Mod11Digits = new HashSet<char> { '6', '7', '9' };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static int CheckDigitFor(int sum, bool useMod11) =>
            useMod11 ? Mod11.Mod11CheckDigit(sum) : Mod11.Mod10CheckDigit(sum);

        private static int[] DescendingWeights(int length)
        {
            int[] weights = new int[length];
            for (int i = 0; i < length; i++)
            {
                weights[i] = length + 1 - i;
            }
            return weights;
        }

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 8 && v.Length != 9)
            {
                return false;
            }

            char discriminant = v.Length == 8 ? v[0] : v[1];
            bool useMod11 = Mod11Digits.Contains(discriminant);

            if (!useMod11 && !Mod10Digits.Contains(discriminant))
            {
                return false;
            }

            int baseLength = v.Length - 2;
            string baseDigits = v.Substring(0, baseLength);
            int lastDigit = CheckDigitFor(Mod11.WeightedSum(baseDigits, DescendingWeights(baseLength)), useMod11);

            if (lastDigit != (v[v.Length - 1] - '0'))
            {
                return false;
            }

            string baseWithLastDigit = baseDigits + lastDigit;
            int firstDigit = CheckDigitFor(
                Mod11.WeightedSum(baseWithLastDigit, DescendingWeights(baseLength + 1)), useMod11);

            return firstDigit == (v[v.Length - 2] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 8 && v.Length != 9)
            {
                return value;
            }

            return $"{v.Substring(0, v.Length - 2)}-{v.Substring(v.Length - 2, 2)}";
        }
    }
}
