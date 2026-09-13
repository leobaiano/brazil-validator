package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-RJ "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RJ.html) for the check-digit
// rule, and cross-checked against a worked example (99.999.99-3) for the
// weights, which the Sintegra page itself does not enumerate.
var (
	rjAllowedChars = regexp.MustCompile(`^[\d.\-\s]+$`)
	rjWeights      = []int{2, 7, 6, 5, 4, 3, 2}
)

func rjNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func rjCalculateCheckDigit(v string) int {
	sum := shared.WeightedSum(v, rjWeights)
	remainder := sum % 11

	if remainder <= 1 {
		return 0
	}

	return 11 - remainder
}

func rjIsValid(value string) bool {
	if !rjAllowedChars.MatchString(value) {
		return false
	}

	v := rjNormalize(value)

	if len(v) != 8 {
		return false
	}

	return rjCalculateCheckDigit(v) == int(v[7]-'0')
}

func rjFormat(value string) string {
	v := rjNormalize(value)

	if len(v) != 8 {
		return value
	}

	return v[:2] + "." + v[2:5] + "." + v[5:7] + "-" + v[7:8]
}
