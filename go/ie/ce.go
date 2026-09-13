package ie

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-CE "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_CE.html), including its worked
// example (06000001-5). Format: 8 digits + 1 check digit.
var (
	ceAllowedChars = regexp.MustCompile(`^[\d\-\s]+$`)
	ceWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func ceNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func ceIsValid(value string) bool {
	if !ceAllowedChars.MatchString(value) {
		return false
	}

	v := ceNormalize(value)

	if len(v) != 9 {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, ceWeights)) == int(v[8]-'0')
}

func ceFormat(value string) string {
	v := ceNormalize(value)

	if len(v) != 9 {
		return value
	}

	return v[:8] + "-" + v[8:9]
}
