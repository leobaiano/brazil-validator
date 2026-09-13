package ie

import (
	"regexp"
	"strconv"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-AP "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_AP.html), including its worked
// example (030123459). Format: "03" (fixed) + 6 sequence digits + 1 check
// digit = 9 digits total. Unlike other states, the weighted sum starts from
// a constant "p" that depends on the numeric range of the registration, and
// a zero remainder maps to a range-dependent digit "d" instead of always 0.
var (
	apAllowedChars = regexp.MustCompile(`^[\d\s]+$`)
	apWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func apNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func apResolveConstants(base int) (p int, d int) {
	if base <= 3017000 {
		return 5, 0
	}

	if base <= 3019022 {
		return 9, 1
	}

	return 0, 0
}

func apCalculateCheckDigit(v string) int {
	base := v[:8]
	baseNumber, _ := strconv.Atoi(base)
	p, d := apResolveConstants(baseNumber)
	sum := p + shared.WeightedSum(base, apWeights)
	remainder := sum % 11

	if remainder == 1 {
		return 0
	}

	if remainder == 0 {
		return d
	}

	return 11 - remainder
}

func apIsValid(value string) bool {
	if !apAllowedChars.MatchString(value) {
		return false
	}

	v := apNormalize(value)

	if len(v) != 9 || v[:2] != "03" {
		return false
	}

	return apCalculateCheckDigit(v) == int(v[8]-'0')
}

func apFormat(value string) string {
	return apNormalize(value)
}
