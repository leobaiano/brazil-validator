using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// AP: verified against the official SEFAZ-AP "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AP.html),
    /// including its worked example (030123459).
    ///
    /// Format: "03" (fixed) + 6 sequence digits + 1 check digit = 9 digits
    /// total. Unlike other states, the weighted sum starts from a constant
    /// "p" that depends on the numeric range of the registration, and a
    /// zero remainder maps to a range-dependent digit "d" instead of always
    /// 0.
    /// </summary>
    internal static class Ap
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static (int p, int d) ResolveConstants(int baseNumber)
        {
            if (baseNumber <= 3017000)
            {
                return (5, 0);
            }

            if (baseNumber <= 3019022)
            {
                return (9, 1);
            }

            return (0, 0);
        }

        private static int CalculateCheckDigit(string v)
        {
            string baseDigits = v.Substring(0, 8);
            (int p, int d) = ResolveConstants(int.Parse(baseDigits));
            int sum = p + Mod11.WeightedSum(baseDigits, Weights);
            int remainder = sum % 11;

            if (remainder == 1)
            {
                return 0;
            }

            if (remainder == 0)
            {
                return d;
            }

            return 11 - remainder;
        }

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 9 || !v.StartsWith("03"))
            {
                return false;
            }

            return CalculateCheckDigit(v) == (v[8] - '0');
        }

        public static string Format(string value) => Normalize(value);
    }
}
