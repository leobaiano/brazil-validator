using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// ES: verified against the official SEFAZ-ES "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_ES.html),
    /// including its worked example (all-9s base -&gt; sum 396). Format: 8
    /// digits + 1 check digit. No official punctuation mask is published,
    /// so Format returns plain digits.
    /// </summary>
    internal static class Es
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\s]+$", RegexOptions.Compiled);
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

        public static string Format(string value) => Normalize(value);
    }
}
