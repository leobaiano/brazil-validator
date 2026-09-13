package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-AL "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_AL.html), including its worked
// example (24000004 -> check digit 8, i.e. 240000048).
// Format: "24" (fixed) + 1 "tipo de empresa" digit (0,3,5,7,8) + 5 sequence
// digits + 1 check digit = 9 digits total. No official punctuation mask is
// published, so Format returns the plain digits.
var (
	alAllowedChars   = regexp.MustCompile(`^[\d\s]+$`)
	alWeights        = []int{9, 8, 7, 6, 5, 4, 3, 2}
	alValidTypeDigit = map[byte]bool{'0': true, '3': true, '5': true, '7': true, '8': true}
)

func alNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func alIsValid(value string) bool {
	if !alAllowedChars.MatchString(value) {
		return false
	}

	v := alNormalize(value)

	if len(v) != 9 || v[:2] != "24" {
		return false
	}

	if !alValidTypeDigit[v[2]] {
		return false
	}

	checkDigit := shared.Mod11TimesTenCheckDigit(shared.WeightedSum(v, alWeights))

	return checkDigit == int(v[8]-'0')
}

func alFormat(value string) string {
	return alNormalize(value)
}
