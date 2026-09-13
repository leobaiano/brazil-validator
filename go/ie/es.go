package ie

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-ES "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_ES.html), including its worked
// example (all-9s base -> sum 396). Format: 8 digits + 1 check digit. No
// official punctuation mask is published, so Format returns plain digits.
var (
	esAllowedChars = regexp.MustCompile(`^[\d\s]+$`)
	esWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func esNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func esIsValid(value string) bool {
	if !esAllowedChars.MatchString(value) {
		return false
	}

	v := esNormalize(value)

	if len(v) != 9 {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, esWeights)) == int(v[8]-'0')
}

func esFormat(value string) string {
	return esNormalize(value)
}
