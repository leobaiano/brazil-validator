using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// GO: verified against the official SEFAZ-GO "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_GO.html),
    /// including its worked example (10.987.654-7). Format: AB.CDE.FGH-I,
    /// where AB must be 10, 11, or 20-29.
    /// </summary>
    internal static class Go
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d.\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static bool HasValidPrefix(string v)
        {
            int prefix = int.Parse(v.Substring(0, 2));

            return prefix == 10 || prefix == 11 || (prefix >= 20 && prefix <= 29);
        }

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 9 || !HasValidPrefix(v))
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

            return $"{v.Substring(0, 2)}.{v.Substring(2, 3)}.{v.Substring(5, 3)}-{v.Substring(8, 1)}";
        }
    }
}
