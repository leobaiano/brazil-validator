using System.Collections.Generic;
using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// TO: verified against the official SEFAZ-TO "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_TO.html),
    /// including its worked example (29010227836). Format: 11 digits, where
    /// positions 3-4 hold a fixed "tipo" code (01 Produtor Rural, 02
    /// Indústria e Comércio, 03 Empresas Rudimentares, 99 Cadastro Antigo)
    /// that is excluded from the check-digit calculation, and position 11
    /// is the check digit.
    /// </summary>
    internal static class To
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d\s]+$", RegexOptions.Compiled);
        private static readonly int[] Weights = { 9, 8, 7, 6, 5, 4, 3, 2 };
        private static readonly HashSet<string> ValidTypeCodes = new HashSet<string> { "01", "02", "03", "99" };
        // 1-based positions used in the check-digit calculation (positions
        // 3-4 are skipped).
        private static readonly int[] DigitPositions = { 1, 2, 5, 6, 7, 8, 9, 10 };

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if (v.Length != 11 || !ValidTypeCodes.Contains(v.Substring(2, 2)))
            {
                return false;
            }

            int sum = 0;
            for (int i = 0; i < DigitPositions.Length; i++)
            {
                sum += (v[DigitPositions[i] - 1] - '0') * Weights[i];
            }

            return Mod11.Mod11CheckDigit(sum) == (v[10] - '0');
        }

        public static string Format(string value) => Normalize(value);
    }
}
