package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-RS "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RS.html), including its worked
// example (224/3658792). Format: 3 digits (município) + 6 digits (empresa)
// + 1 check digit = 10 digits total.
var (
	rsAllowedChars = regexp.MustCompile(`^[\d/\s]+$`)
	rsWeights      = []int{2, 9, 8, 7, 6, 5, 4, 3, 2}
)

func rsNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func rsIsValid(value string) bool {
	if !rsAllowedChars.MatchString(value) {
		return false
	}

	v := rsNormalize(value)

	if len(v) != 10 {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, rsWeights)) == int(v[9]-'0')
}

func rsFormat(value string) string {
	v := rsNormalize(value)

	if len(v) != 10 {
		return value
	}

	return v[:3] + "/" + v[3:10]
}
