package ie

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-RN "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_RN.html), including both of
// its worked examples (20.040.040-1 and 20.0.040.040-0). Format: always
// starts with "20", followed by either 7 or 8 more digits, plus 1 check
// digit (9 or 10 digits total, both still valid today per the official
// page).
var rnAllowedChars = regexp.MustCompile(`^[\d.\-\s]+$`)

func rnNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func rnWeightsFor(baseLength int) []int {
	weights := make([]int, baseLength)
	for i := 0; i < baseLength; i++ {
		weights[i] = baseLength + 1 - i
	}

	return weights
}

func rnIsValid(value string) bool {
	if !rnAllowedChars.MatchString(value) {
		return false
	}

	v := rnNormalize(value)

	if (len(v) != 9 && len(v) != 10) || v[:2] != "20" {
		return false
	}

	base := v[:len(v)-1]
	checkDigit := shared.Mod11TimesTenCheckDigit(shared.WeightedSum(base, rnWeightsFor(len(base))))

	return checkDigit == int(v[len(v)-1]-'0')
}

func rnFormat(value string) string {
	v := rnNormalize(value)

	switch len(v) {
	case 9:
		return v[:2] + "." + v[2:5] + "." + v[5:8] + "-" + v[8:9]
	case 10:
		return v[:2] + "." + v[2:3] + "." + v[3:6] + "." + v[6:9] + "-" + v[9:10]
	default:
		return value
	}
}
