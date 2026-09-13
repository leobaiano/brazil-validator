using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// RJ: verified against the official SEFAZ-RJ "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RJ.html) for the
    /// check-digit rule, and cross-checked against a worked example
    /// (99.999.99-3) for the weights, which the Sintegra page itself does
    /// not enumerate.
    /// </summary>
    internal static class Rj
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d.\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 2, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static int CalculateCheckDigit(string v)
        {
            int sum = Mod11.WeightedSum(v, Weights);
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

            if (v.Length != 8)
            {
                return false;
            }

            return CalculateCheckDigit(v) == (v[7] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 8)
            {
                return value;
            }

            return $"{v.Substring(0, 2)}.{v.Substring(2, 3)}.{v.Substring(5, 2)}-{v.Substring(7, 1)}";
        }
    }
}
