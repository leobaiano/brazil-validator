package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-MS "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_MS.html) for the algorithm
// (which the page does not accompany with a worked numeric example), plus
// an independently hand-computed regression vector (281234566). Format: 8
// digits (always starting with "28" or "50") + 1 check digit.
var (
	msAllowedChars = regexp.MustCompile(`^[\d\s]+$`)
	msWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func msNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func msHasValidPrefix(v string) bool {
	prefix := v[:2]

	return prefix == "28" || prefix == "50"
}

func msIsValid(value string) bool {
	if !msAllowedChars.MatchString(value) {
		return false
	}

	v := msNormalize(value)

	if len(v) != 9 || !msHasValidPrefix(v) {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, msWeights)) == int(v[8]-'0')
}

func msFormat(value string) string {
	return msNormalize(value)
}
