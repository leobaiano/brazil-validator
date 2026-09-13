using System.Text.RegularExpressions;
using BrValidator.Internal;

namespace BrValidator.Ie
{
    /// <summary>
    /// RN: verified against the official SEFAZ-RN "Roteiro de Crítica da
    /// Inscrição Estadual" (sintegra.gov.br/Cad_Estados/cad_RN.html),
    /// including both of its worked examples (20.040.040-1 and
    /// 20.0.040.040-0). Format: always starts with "20", followed by either
    /// 7 or 8 more digits, plus 1 check digit (9 or 10 digits total, both
    /// still valid today per the official page).
    /// </summary>
    internal static class Rn
    {
        private static readonly Regex AllowedChars = new Regex(@"^[\d.\-\s]+$", RegexOptions.Compiled);

        public static string Normalize(string value) => Shared.RemoveNonDigits(value);

        private static int[] WeightsFor(int baseLength)
        {
            int[] weights = new int[baseLength];
            for (int i = 0; i < baseLength; i++)
            {
                weights[i] = baseLength + 1 - i;
            }
            return weights;
        }

        public static bool IsValid(string value)
        {
            if (!AllowedChars.IsMatch(value))
            {
                return false;
            }

            string v = Normalize(value);

            if ((v.Length != 9 && v.Length != 10) || !v.StartsWith("20"))
            {
                return false;
            }

            string baseDigits = v.Substring(0, v.Length - 1);
            int checkDigit = Mod11.Mod11TimesTenCheckDigit(
                Mod11.WeightedSum(baseDigits, WeightsFor(baseDigits.Length)));

            return checkDigit == (v[v.Length - 1] - '0');
        }

        public static string Format(string value)
        {
            string v = Normalize(value);

            if (v.Length == 9)
            {
                return $"{v.Substring(0, 2)}.{v.Substring(2, 3)}.{v.Substring(5, 3)}-{v.Substring(8, 1)}";
            }

            if (v.Length == 10)
            {
                return $"{v.Substring(0, 2)}.{v.Substring(2, 1)}.{v.Substring(3, 3)}.{v.Substring(6, 3)}-{v.Substring(9, 1)}";
            }

            return value;
        }
    }
}
