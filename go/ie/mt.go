package ie

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-MT "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_MT.html), including its worked
// example (0013000001-9). Format: 10 digits + 1 check digit.
var (
	mtAllowedChars = regexp.MustCompile(`^[\d\-\s]+$`)
	mtWeights      = []int{3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
)

func mtNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func mtIsValid(value string) bool {
	if !mtAllowedChars.MatchString(value) {
		return false
	}

	v := mtNormalize(value)

	if len(v) != 11 {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, mtWeights)) == int(v[10]-'0')
}

func mtFormat(value string) string {
	v := mtNormalize(value)

	if len(v) != 11 {
		return value
	}

	return v[:10] + "-" + v[10:11]
}
