using System.Text.RegularExpressions;

namespace BrValidator
{
    /// <summary>Validates, normalizes, and formats e-mail addresses.</summary>
    public static class Email
    {
        // Sourced from the WHATWG HTML Living Standard's email state regex
        // (used by browsers to validate <input type="email">). All
        // quantifiers are bounded, so it cannot suffer catastrophic
        // backtracking.
        private static readonly Regex EmailRegex = new Regex(
            @"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?" +
            @"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
            RegexOptions.Compiled);

        private const int MaxEmailLength = 254;
        private const int MaxLocalPartLength = 64;

        /// <summary>Trims whitespace and lowercases value.</summary>
        public static string Normalize(string value) => value.Trim().ToLowerInvariant();

        /// <summary>
        /// Returns true if value is a structurally valid e-mail address, per
        /// the WHATWG regular expression plus RFC 5321 length limits.
        /// </summary>
        public static bool IsValid(string value)
        {
            string email = Normalize(value);

            if (email.Length == 0 || email.Length > MaxEmailLength)
            {
                return false;
            }

            int atIndex = email.IndexOf('@');
            string localPart = atIndex >= 0 ? email.Substring(0, atIndex) : email;

            if (localPart.Length == 0 || localPart.Length > MaxLocalPartLength)
            {
                return false;
            }

            return EmailRegex.IsMatch(email);
        }

        /// <summary>
        /// Returns the same canonical value as <see cref="Normalize"/>.
        /// Unlike CPF/CNPJ/CEP/Phone, an e-mail address has no visual mask
        /// to apply.
        /// </summary>
        public static string Format(string value) => Normalize(value);
    }
}
