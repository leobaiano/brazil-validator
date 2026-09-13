package shared

// WeightedSum multiplies each digit of value by the weight at the same
// index and sums the products. Used by most Inscrição Estadual algorithms
// (SEFAZ "Roteiro de Crítica" documents).
func WeightedSum(value string, weights []int) int {
	sum := 0

	for i, w := range weights {
		sum += int(value[i]-'0') * w
	}

	return sum
}

// Mod11CheckDigit is the most common check-digit rule across states:
// remainder 0 or 1 maps to digit 0, otherwise the digit is 11 minus the
// remainder.
func Mod11CheckDigit(sum int) int {
	remainder := sum % 11

	if remainder <= 1 {
		return 0
	}

	return 11 - remainder
}

// Mod10CheckDigit is used by Bahia's módulo-10 branch: remainder 0 maps to
// digit 0, otherwise the digit is 10 minus the remainder.
func Mod10CheckDigit(sum int) int {
	remainder := sum % 10

	if remainder == 0 {
		return 0
	}

	return 10 - remainder
}

// Mod11TimesTenCheckDigit is used by Alagoas and Rio Grande do Norte: the
// sum is multiplied by 10 before reducing modulo 11, and the remainder *is*
// the digit directly (a remainder of 10 wraps to 0). Mirrors CPF's
// check-digit formula.
func Mod11TimesTenCheckDigit(sum int) int {
	remainder := (sum * 10) % 11

	if remainder == 10 {
		return 0
	}

	return remainder
}
