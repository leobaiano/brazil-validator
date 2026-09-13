package ie

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-SC "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_SC.html), including its worked
// example (251.040.852). Format: 8 digits + 1 check digit.
var (
	scAllowedChars = regexp.MustCompile(`^[\d.\s]+$`)
	scWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func scNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func scIsValid(value string) bool {
	if !scAllowedChars.MatchString(value) {
		return false
	}

	v := scNormalize(value)

	if len(v) != 9 {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, scWeights)) == int(v[8]-'0')
}

func scFormat(value string) string {
	v := scNormalize(value)

	if len(v) != 9 {
		return value
	}

	return v[:3] + "." + v[3:6] + "." + v[6:9]
}
