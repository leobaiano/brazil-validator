using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// MT: verified against the official SEFAZ-MT "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_MT.html),
    /// including its worked example (0013000001-9). Format: 10 digits + 1
    /// check digit.
    /// </summary>
    internal static class Mt
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 11)
            {
                return false;
            }

            return Mod11.Mod11CheckDigit(Mod11.WeightedSum(v, Weights)) == (v[10] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 11)
            {
                return value;
            }

            return $"{v.Substring(0, 10)}-{v.Substring(10, 1)}";
        }
    }
}
