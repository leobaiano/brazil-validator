package ie

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-PI "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_PI.html), including its worked
// example (012345679). Format: 8 digits + 1 check digit.
var (
	piAllowedChars = regexp.MustCompile(`^[\d\s]+$`)
	piWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func piNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func piIsValid(value string) bool {
	if !piAllowedChars.MatchString(value) {
		return false
	}

	v := piNormalize(value)

	if len(v) != 9 {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, piWeights)) == int(v[8]-'0')
}

func piFormat(value string) string {
	return piNormalize(value)
}
