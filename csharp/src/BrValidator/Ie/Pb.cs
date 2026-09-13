using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// PB: verified against the official SEFAZ-PB "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_PB.html),
    /// including its worked example (06000001-5). Format: 8 digits + 1
    /// check digit.
    /// </summary>
    internal static class Pb
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 9, 8, 7, 6, 5, 4, 3, 2 };

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
