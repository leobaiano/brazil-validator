namespace BrValidator.Ie
{
    /// <summary>
    /// Shared by most Inscrição Estadual algorithms (SEFAZ "Roteiro de
    /// Crítica" documents): weight each digit, sum the products, then
    /// reduce modulo 11. Internal: not part of the public API.
    /// </summary>
    internal static class Mod11
    {
        public static int WeightedSum(string digits, int[] weights)
        {
            int sum = 0;

            for (int i = 0; i < weights.Length; i++)
            {
                sum += (digits[i] - '0') * weights[i];
            }

            return sum;
        }

        /// <summary>
        /// The most common check-digit rule across states: remainder 0 or 1
        /// maps to digit 0, otherwise the digit is 11 minus the remainder.
        /// </summary>
        public static int Mod11CheckDigit(int sum)
        {
            int remainder = sum % 11;

            return remainder <= 1 ? 0 : 11 - remainder;
        }

        /// <summary>
        /// Used by Bahia's módulo-10 branch: remainder 0 maps to digit 0,
        /// otherwise the digit is 10 minus the remainder.
        /// </summary>
        public static int Mod10CheckDigit(int sum)
        {
            int remainder = sum % 10;

            return remainder == 0 ? 0 : 10 - remainder;
        }

        /// <summary>
        /// Used by Alagoas and Rio Grande do Norte: the sum is multiplied by
        /// 10 before reducing modulo 11, and the remainder *is* the digit
        /// directly (a remainder of 10 wraps to 0). Mirrors CPF's
        /// check-digit formula.
        /// </summary>
        public static int Mod11TimesTenCheckDigit(int sum)
        {
            int remainder = (sum * 10) % 11;

            return remainder == 10 ? 0 : remainder;
        }
    }
}
