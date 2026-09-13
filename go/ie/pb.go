package ie

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-PB "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_PB.html), including its worked
// example (06000001-5). Format: 8 digits + 1 check digit.
var (
	pbAllowedChars = regexp.MustCompile(`^[\d\-\s]+$`)
	pbWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func pbNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func pbIsValid(value string) bool {
	if !pbAllowedChars.MatchString(value) {
		return false
	}

	v := pbNormalize(value)

	if len(v) != 9 {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, pbWeights)) == int(v[8]-'0')
}

func pbFormat(value string) string {
	v := pbNormalize(value)

	if len(v) != 9 {
		return value
	}

	return v[:8] + "-" + v[8:9]
}
