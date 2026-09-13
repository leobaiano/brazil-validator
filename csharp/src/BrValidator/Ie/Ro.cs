using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// RO: verified against the official SEFAZ-RO "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RO.html),
    /// including its worked example (0000000062521-3). Since 01/08/2000 the
    /// format is 13 digits + 1 check digit (the old "município + empresa"
    /// layout is superseded, with old registrations re-expressed by
    /// zero-padding into the new 13-digit field).
    ///
    /// The weights cycle 2-9 applied right to left over the 13 digits, i.e.
    /// [6,5,4,3,2,9,8,7,6,5,4,3,2] read left to right. Unlike most other
    /// states, a zero remainder maps to check digit 1, not 0 (the source
    /// explicitly says "subtract 10" from the 11-or-10 result, rather than
    /// mapping straight to 0).
    /// </summary>
    internal static class Ro
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d.\-\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static int CalculateCheckDigit(string baseDigits)
        {
            int remainder = Mod11.WeightedSum(baseDigits, Weights) % 11;
            int diff = 11 - remainder;

            return diff > 9 ? diff - 10 : diff;
        }

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 14)
            {
                return false;
            }

            return CalculateCheckDigit(v.Substring(0, 13)) == (v[13] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length != 14)
            {
                return value;
            }

            return $"{v.Substring(0, 13)}-{v.Substring(13, 1)}";
        }
    }
}
