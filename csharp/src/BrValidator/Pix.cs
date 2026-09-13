using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator
{
    /// <summary>
    /// Validates, normalizes, and formats PIX keys (CPF, CNPJ, e-mail, phone,
    /// or random key).
    /// </summary>
    public static class Pix
    {
        // Formats verified against Bacen's official DICT schema
        // (github.com/bacen/pix-dict-api openapi.yaml) and the Manual de
        // Padrões para Iniciação do Pix:
        // - CPF/CNPJ keys are digits-only (^[0-9]{11}$ / ^[0-9]{14}$). The
        //   DICT schema does not yet accept alphanumeric CNPJ as a key.
        // - The EVP (random key) is a canonical, case-insensitive UUID
        //   (8-4-4-4-12).
        // - Phone keys use the international format "+55AANNNNNNNNN", where
        //   AA is the DDD and NNNNNNNNN is a 9-digit mobile number --
        //   Brazilian Pix only registers Brazilian mobile numbers, so the
        //   country code is fixed at 55.
        // - Email keys are case-insensitive and capped at 77 characters.
        private static readonly Regex EvpRegex = new Regex(
            @"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static readonly Regex CpfShape = new Regex(@"^\d{11}$", RegexOptions.Compiled);
        private static readonly Regex CnpjShape = new Regex(@"^\d{14}$", RegexOptions.Compiled);
        private static readonly Regex PhoneChars = new Regex(@"^[\d\s()+-]+$", RegexOptions.Compiled);
        private static readonly Regex PhoneKeyForm = new Regex(@"^\+55\d{11}$", RegexOptions.Compiled);

        private const int MaxEmailKeyLength = 77;

        /// <summary>
        /// Detects which kind of PIX key value looks like, or null if it
        /// matches none.
        /// </summary>
        public static PixKeyType? GetKeyType(string value)
        {
            string trimmed = value.Trim();

            if (EvpRegex.IsMatch(trimmed))
            {
                return PixKeyType.Evp;
            }

            if (trimmed.Contains("@"))
            {
                return PixKeyType.Email;
            }

            if (trimmed.StartsWith("+"))
            {
                return PixKeyType.Phone;
            }

            if (CpfShape.IsMatch(trimmed))
            {
                return PixKeyType.Cpf;
            }

            if (CnpjShape.IsMatch(trimmed))
            {
                return PixKeyType.Cnpj;
            }

            return null;
        }

        private static string NormalizePhoneKey(string value) => "+" + Shared.RemoveNonDigits(value);

        private static bool IsValidPhoneKey(string value)
        {
            if (!PhoneChars.IsMatch(value))
            {
                return false;
            }

            string phone = NormalizePhoneKey(value);

            if (!PhoneKeyForm.IsMatch(phone))
            {
                return false;
            }

            string ddd = phone.Substring(3, 2);
            char subscriberFirstDigit = phone[5];

            return Shared.ValidDdds.Contains(ddd) && subscriberFirstDigit == '9';
        }

        private static string FormatPhoneKey(string value)
        {
            string phone = NormalizePhoneKey(value);

            if (!PhoneKeyForm.IsMatch(phone))
            {
                return value;
            }

            return "+55 " + Phone.Format(phone.Substring(3));
        }

        /// <summary>Returns true if value is a valid PIX key of any recognized type.</summary>
        public static bool IsValid(string value)
        {
            PixKeyType? keyType = GetKeyType(value);

            if (keyType == null)
            {
                return false;
            }

            string trimmed = value.Trim();

            switch (keyType)
            {
                case PixKeyType.Cpf:
                    return Cpf.IsValid(trimmed);
                case PixKeyType.Cnpj:
                    return Cnpj.IsValid(trimmed);
                case PixKeyType.Email:
                    return trimmed.Length <= MaxEmailKeyLength && Email.IsValid(trimmed);
                case PixKeyType.Phone:
                    return IsValidPhoneKey(trimmed);
                case PixKeyType.Evp:
                    return true;
                default:
                    return false;
            }
        }

        /// <summary>
        /// Dispatches to the canonical normalize rule of value's detected
        /// key type. If the type cannot be detected, value is returned
        /// unchanged.
        /// </summary>
        public static string Normalize(string value)
        {
            PixKeyType? keyType = GetKeyType(value);

            if (keyType == null)
            {
                return value;
            }

            string trimmed = value.Trim();

            switch (keyType)
            {
                case PixKeyType.Cpf:
                    return Cpf.Normalize(trimmed);
                case PixKeyType.Cnpj:
                    return Cnpj.Normalize(trimmed);
                case PixKeyType.Email:
                    return Email.Normalize(trimmed);
                case PixKeyType.Phone:
                    return NormalizePhoneKey(trimmed);
                case PixKeyType.Evp:
                    return trimmed.ToLowerInvariant();
                default:
                    return value;
            }
        }

        /// <summary>
        /// Dispatches to the canonical format rule of value's detected key
        /// type. If the type cannot be detected, value is returned
        /// unchanged.
        /// </summary>
        public static string Format(string value)
        {
            PixKeyType? keyType = GetKeyType(value);

            if (keyType == null)
            {
                return value;
            }

            string trimmed = value.Trim();

            switch (keyType)
            {
                case PixKeyType.Cpf:
                    return Cpf.Format(trimmed);
                case PixKeyType.Cnpj:
                    return Cnpj.Format(trimmed);
                case PixKeyType.Email:
                    return Email.Format(trimmed);
                case PixKeyType.Phone:
                    return FormatPhoneKey(trimmed);
                case PixKeyType.Evp:
                    return trimmed.ToLowerInvariant();
                default:
                    return value;
            }
        }
    }
}
