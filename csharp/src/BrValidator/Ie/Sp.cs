using System.Text.RegularExpressions;

namespace BrValidator.Ie
{
    /// <summary>
    /// SP: verified against the official SEFAZ-SP "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_SP.html),
    /// including both of its worked examples: the standard
    /// industrial/commercial format (110.042.490.114) and the "Produtor
    /// Rural" format (P-01100424.3/002).
    ///
    /// Note: the source restates the Produtor Rural example at the very end
    /// as "P-011000424.3/002" (14 characters) -- this contradicts both the
    /// document's own "13 caracteres" rule and its worked calculation
    /// (which sums exactly 8 digits to 91, matching the 13-character form).
    /// Treated as a typo in the source; the 13-character form is what this
    /// module expects.
    /// </summary>
    internal static class Sp
    {
        private static readonly Regex StandardAllowedChars = new Regex(@"^[\d.\s]+$", RegexOptions.Compiled);
        private static readonly Regex ProdutorRuralAllowed = new Regex(@"^[Pp\d.\-/\s]+$", RegexOptions.Compiled);
        private static readonly Regex FormattingChars = new Regex(@"[.\-/\s]", RegexOptions.Compiled);
        private static readonly Regex ProdutorRuralPrefix = new Regex(@"^\s*[Pp]", RegexOptions.Compiled);

        private static readonly int[] StandardFirstDigitWeights = { 1, 3, 4, 5, 6, 7, 8, 10 };
        private static readonly int[] StandardSecondDigitWeights = { 3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
        private static readonly int[] ProdutorRuralWeights = { 1, 3, 4, 5, 6, 7, 8, 10 };

        private static int CalculateCheckDigit(string digits, int[] weights)
        {
            int sum = Mod11.WeightedSum(digits, weights);

            return sum % 11 == 10 ? 0 : sum % 11;
        }

        private static bool IsProdutorRural(string value) => ProdutorRuralPrefix.IsMatch(value);

        private static string NormalizeStandard(string value) => Internal.Shared.RemoveNonDigits(value);

        private static bool IsValidStandard(string value)
        {
            if (!StandardAllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = NormalizeStandard(value);

            if (v.Length != 12)
            {
                return false;
            }

            int firstDigit = CalculateCheckDigit(v, StandardFirstDigitWeights);
            if (firstDigit != (v[8] - '0'))
            {
                return false;
            }

            int secondDigit = CalculateCheckDigit(v, StandardSecondDigitWeights);

            return secondDigit == (v[11] - '0');
        }

        private static string FormatStandard(string value)
        {
            string v = NormalizeStandard(value);

            if (v.Length != 12)
            {
                return value;
            }

            return $"{v.Substring(0, 3)}.{v.Substring(3, 3)}.{v.Substring(6, 3)}.{v.Substring(9, 3)}";
        }

        // Format: P0MMMSSSSD000 (13 characters) -- "P" (fixed) + "0" (fixed)
        // + 3 município digits + 4 sequence digits + 1 check digit + 3
        // unused digits.
        private static string NormalizeProdutorRural(string value) =>
            FormattingChars.Replace(value, "").ToUpperInvariant();

        private static bool IsValidProdutorRural(string value)
        {
            if (!ProdutorRuralAllowed.IsMatch(value))
            {
                return false;
            }

            string v = NormalizeProdutorRural(value);

            if (v.Length != 13 || v[0] != 'P' || v[1] != '0')
            {
                return false;
            }

            string baseDigits = v.Substring(1, 8);
            int checkDigit = CalculateCheckDigit(baseDigits, ProdutorRuralWeights);

            return checkDigit == (v[9] - '0');
        }

        private static string FormatProdutorRural(string value)
        {
            string v = NormalizeProdutorRural(value);

            if (v.Length != 13)
            {
                return value;
            }

            return $"P-{v.Substring(1, 8)}.{v.Substring(9, 1)}/{v.Substring(10, 3)}";
        }

        public static bool IsValid(string value) =>
            IsProdutorRural(value) ? IsValidProdutorRural(value) : IsValidStandard(value);

        public static string Normalize(string value) =>
            IsProdutorRural(value) ? NormalizeProdutorRural(value) : NormalizeStandard(value);

        public static string Format(string value) =>
            IsProdutorRural(value) ? FormatProdutorRural(value) : FormatStandard(value);
    }
}
