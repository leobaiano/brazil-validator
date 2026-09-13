package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-SE "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_SE.html), including its worked
// example (27123456-3). Format: 8 digits + 1 check digit.
var (
	seAllowedChars = regexp.MustCompile(`^[\d\-\s]+$`)
	seWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func seNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func seIsValid(value string) bool {
	if !seAllowedChars.MatchString(value) {
		return false
	}

	v := seNormalize(value)

	if len(v) != 9 {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, seWeights)) == int(v[8]-'0')
}

func seFormat(value string) string {
	v := seNormalize(value)

	if len(v) != 9 {
		return value
	}

	return v[:8] + "-" + v[8:9]
}
