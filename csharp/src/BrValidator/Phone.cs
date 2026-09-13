using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator
{
    /// <summary>
    /// Validates, normalizes, and formats Brazilian national phone numbers
    /// (mobile and landline, no +55 country code).
    /// </summary>
    public static class Phone
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\s()-]+$", RegexOptions.Compiled);

        /// <summary>
        /// Strips formatting and returns the canonical (digits-only)
        /// representation of value.
        /// </summary>
        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        /// <summary>
        /// Returns true if value is a structurally valid Brazilian phone
        /// number. Enforces Anatel's numbering plan: the DDD must be one of
        /// the 67 codes actually assigned, mobile numbers (11 digits) must
        /// carry the "ninth digit" 9 (Resolução nº 553/2010), and landline
        /// numbers (10 digits) must start with 2-5.
        /// </summary>
        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string phone = Normalize(value);

            if (phone.Length != 10 && phone.Length != 11)
            {
                return false;
            }

            string ddd = phone.Substring(0, 2);

            if (!Shared.ValidDdds.Contains(ddd))
            {
                return false;
            }

            char subscriberFirstDigit = phone[2];

            if (phone.Length == 11)
            {
                return subscriberFirstDigit == '9';
            }

            return "2345".IndexOf(subscriberFirstDigit) >= 0;
        }

        /// <summary>
        /// Returns value as (XX) XXXXX-XXXX (mobile) or (XX) XXXX-XXXX
        /// (landline). If the normalized value has an invalid length, value
        /// is returned unchanged.
        /// </summary>
        public static string Format(string value)
        {
            string phone = Normalize(value);

            if (phone.Length == 11)
            {
                return $"({phone.Substring(0, 2)}) {phone.Substring(2, 5)}-{phone.Substring(7, 4)}";
            }

            if (phone.Length == 10)
            {
                return $"({phone.Substring(0, 2)}) {phone.Substring(2, 4)}-{phone.Substring(6, 4)}";
            }

            return value;
        }
    }
}
