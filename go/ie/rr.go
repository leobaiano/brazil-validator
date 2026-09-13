package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-RR "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RR.html), including its worked
// example (24006153-6) and the ten additional valid numbers it lists.
// Format: "24" (fixed) + 6 sequence digits + 1 check digit = 9 digits
// total. Unlike every other state, the check digit uses módulo 9, and the
// weights are the digit's own 1-based position (ascending, not
// descending).
var (
	rrAllowedChars = regexp.MustCompile(`^[\d\-\s]+$`)
	rrWeights      = []int{1, 2, 3, 4, 5, 6, 7, 8}
)

func rrNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func rrIsValid(value string) bool {
	if !rrAllowedChars.MatchString(value) {
		return false
	}

	v := rrNormalize(value)

	if len(v) != 9 || v[:2] != "24" {
		return false
	}

	checkDigit := shared.WeightedSum(v, rrWeights) % 9

	return checkDigit == int(v[8]-'0')
}

func rrFormat(value string) string {
	v := rrNormalize(value)

	if len(v) != 9 {
		return value
	}

	return v[:8] + "-" + v[8:9]
}
