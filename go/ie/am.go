package ie

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-AM "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_AM.html). Format: 99.999.999-9
// (8 digits + 1 check digit). Unlike most other states, when the weighted
// sum itself is below 11 the digit is 11 minus the sum directly (skipping
// the modulo step).
var (
	amAllowedChars = regexp.MustCompile(`^[\d.\-\s]+$`)
	amWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func amNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func amCalculateCheckDigit(v string) int {
	sum := shared.WeightedSum(v, amWeights)

	if sum < 11 {
		return 11 - sum
	}

	return shared.Mod11CheckDigit(sum)
}

func amIsValid(value string) bool {
	if !amAllowedChars.MatchString(value) {
		return false
	}

	v := amNormalize(value)

	if len(v) != 9 {
		return false
	}

	return amCalculateCheckDigit(v) == int(v[8]-'0')
}

func amFormat(value string) string {
	v := amNormalize(value)

	if len(v) != 9 {
		return value
	}

	return v[:2] + "." + v[2:5] + "." + v[5:8] + "-" + v[8:9]
}
