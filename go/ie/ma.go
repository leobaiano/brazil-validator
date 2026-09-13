package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-MA "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_MA.html), including its worked
// example (120000385). Format: "12" (fixed) + 6 sequence digits + 1 check
// digit = 9 digits total. No official punctuation mask is published, so
// Format returns plain digits.
var (
	maAllowedChars = regexp.MustCompile(`^[\d\s]+$`)
	maWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func maNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func maIsValid(value string) bool {
	if !maAllowedChars.MatchString(value) {
		return false
	}

	v := maNormalize(value)

	if len(v) != 9 || v[:2] != "12" {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, maWeights)) == int(v[8]-'0')
}

func maFormat(value string) string {
	return maNormalize(value)
}
