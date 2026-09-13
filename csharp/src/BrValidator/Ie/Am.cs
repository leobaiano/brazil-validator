using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// AM: verified against the official SEFAZ-AM "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_AM.html).
    /// Format: 99.999.999-9 (8 digits + 1 check digit). Unlike most other
    /// states, when the weighted sum itself is below 11 the digit is 11
    /// minus the sum directly (skipping the modulo step).
    /// </summary>
    internal static class Am
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d.\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static int CalculateCheckDigit(string v)
        {
            int sum = Mod11.WeightedSum(v, Weights);

            return sum < 11 ? 11 - sum : Mod11.Mod11CheckDigit(sum);
        }

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

            return CalculateCheckDigit(v) == (v[8] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 9)
            {
                return value;
            }

            return $"{v.Substring(0, 2)}.{v.Substring(2, 3)}.{v.Substring(5, 3)}-{v.Substring(8, 1)}";
        }
    }
}
