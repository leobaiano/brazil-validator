using System.Text.RegularExpressions;

namespace BrValidator
{
    /// <summary>
    /// Validates, normalizes, and formats Brazilian CNPJ numbers. Covers both
    /// the traditional numeric format and the alphanumeric format introduced
    /// by Receita Federal.
    /// </summary>
    public static class Cnpj
    {
        private static readonly Regex AllowedChars = new Regex(@"^[A-Za-z0-9.\-/\s]+$", RegexOptions.Compiled);
        private static readonly Regex FormattingChars = new Regex(@"[.\-/\s]", RegexOptions.Compiled);
        private static readonly Regex NormalizedShape = new Regex(@"^[A-Z0-9]{12}\d{2}$", RegexOptions.Compiled);

        /// <summary>
        /// Strips formatting and uppercases value. A digit-only strip would
        /// destroy alphanumeric CNPJ values, so only separator characters are
        /// removed.
        /// </summary>
        public static string Normalize(string value) => FormattingChars.Replace(value, "").ToUpperInvariant();

        private static int CharacterValue(char c) => c - 48;

        private static int CalculateCheckDigit(string value)
        {
            int sum = 0;
            int weight = value.Length == 12 ? 5 : 6;

            foreach (char c in value)
            {
                sum += CharacterValue(c) * weight;
                weight--;

                if (weight == 1)
                {
                    weight = 9;
                }
            }

            int remainder = sum % 11;

            if (remainder == 0 || remainder == 1)
            {
                return 0;
            }

            return 11 - remainder;
        }

        /// <summary>
        /// Returns true if value is a structurally and check-digit valid
        /// CNPJ, numeric or alphanumeric. Accepts raw or formatted input but
        /// rejects unexpected characters.
        /// </summary>
        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string cnpj = Normalize(value);

            if (!NormalizedShape.IsMatch(cnpj))
            {
                return false;
            }

            int firstDigit = CalculateCheckDigit(cnpj.Substring(0, 12));
            if (firstDigit != (cnpj[12] - '0'))
            {
                return false;
            }

            int secondDigit = CalculateCheckDigit(cnpj.Substring(0, 13));

            return secondDigit == (cnpj[13] - '0');
        }

        /// <summary>
        /// Returns value as XX.XXX.XXX/XXXX-XX. If the normalized value has
        /// an invalid length, value is returned unchanged.
        /// </summary>
        public static string Format(string value)
        {
            string cnpj = Normalize(value);

            if (cnpj.Length != 14)
            {
                return value;
            }

            return $"{cnpj.Substring(0, 2)}.{cnpj.Substring(2, 3)}.{cnpj.Substring(5, 3)}/{cnpj.Substring(8, 4)}-{cnpj.Substring(12, 2)}";
        }
    }
}
