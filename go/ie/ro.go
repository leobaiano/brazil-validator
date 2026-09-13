package ie

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-RO "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RO.html), including its worked
// example (0000000062521-3). Since 01/08/2000 the format is 13 digits + 1
// check digit (the old "município + empresa" layout is superseded, with old
// registrations re-expressed by zero-padding into the new 13-digit field).
//
// The weights cycle 2-9 applied right to left over the 13 digits, i.e.
// [6,5,4,3,2,9,8,7,6,5,4,3,2] read left to right. Unlike most other states,
// a zero remainder maps to check digit 1, not 0 (the source explicitly says
// "subtract 10" from the 11-or-10 result, rather than mapping straight to 0).
var (
	roAllowedChars = regexp.MustCompile(`^[\d.\-\s]+$`)
	roWeights      = []int{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
)

func roNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func roCalculateCheckDigit(base string) int {
	remainder := shared.WeightedSum(base, roWeights) % 11
	diff := 11 - remainder

	if diff > 9 {
		return diff - 10
	}

	return diff
}

func roIsValid(value string) bool {
	if !roAllowedChars.MatchString(value) {
		return false
	}

	v := roNormalize(value)

	if len(v) != 14 {
		return false
	}

	return roCalculateCheckDigit(v[:13]) == int(v[13]-'0')
}

func roFormat(value string) string {
	v := roNormalize(value)

	if len(v) != 14 {
		return value
	}

	return v[:13] + "-" + v[13:14]
}
