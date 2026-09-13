using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// RS: verified against the official SEFAZ-RS "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RS.html),
    /// including its worked example (224/3658792). Format: 3 digits
    /// (município) + 6 digits (empresa) + 1 check digit = 10 digits total.
    /// </summary>
    internal static class Rs
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d/\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 2, 9, 8, 7, 6, 5, 4, 3, 2 };

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

            return Mod11.Mod11CheckDigit(Mod11.WeightedSum(v, Weights)) == (v[9] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 10)
            {
                return value;
            }

            return $"{v.Substring(0, 3)}/{v.Substring(3, 7)}";
        }
    }
}
