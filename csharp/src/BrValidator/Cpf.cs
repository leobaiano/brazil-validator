using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator
{
    /// <summary>Validates, normalizes, and formats Brazilian CPF numbers.</summary>
    public static class Cpf
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d.\-\s]+$", RegexOptions.Compiled);
        private static readonly Regex RepeatedDigits = new Regex(@"^(\d)\1{10}$", RegexOptions.Compiled);

        /// <summary>
        /// Strips formatting and returns the canonical (digits-only)
        /// representation of value.
        /// </summary>
        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static int CalculateCheckDigit(string cpf, int weight)
        {
            int sum = 0;

            for (int i = 0; i < cpf.Length; i++)
            {
                sum += (cpf[i] - '0') * (weight - i);
            }

            int remainder = (sum * 10) % 11;

            return remainder == 10 ? 0 : remainder;
        }

        /// <summary>
        /// Returns true if value is a structurally and check-digit valid CPF.
        /// Accepts raw or formatted input but rejects unexpected characters.
        /// </summary>
        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string cpf = Normalize(value);

            if (cpf.Length != 11)
            {
                return false;
            }

            if (RepeatedDigits.IsMatch(cpf))
            {
                return false;
            }

            int firstDigit = CalculateCheckDigit(cpf.Substring(0, 9), 10);
            if (firstDigit != (cpf[9] - '0'))
            {
                return false;
            }

            int secondDigit = CalculateCheckDigit(cpf.Substring(0, 10), 11);

            return secondDigit == (cpf[10] - '0');
        }

        /// <summary>
        /// Returns value as XXX.XXX.XXX-XX. If the normalized value has an
        /// invalid length, value is returned unchanged.
        /// </summary>
        public static string Format(string value)
        {
            string cpf = Normalize(value);

            if (cpf.Length != 11)
            {
                return value;
            }

            return $"{cpf.Substring(0, 3)}.{cpf.Substring(3, 3)}.{cpf.Substring(6, 3)}-{cpf.Substring(9, 2)}";
        }
    }
}
