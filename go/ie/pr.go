package ie

import (
	"regexp"
	"strconv"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-PR "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_PR.html), including its fully
// worked example (123.45678-50), and cross-checked against the reference
// Visual Basic routine published on the same page. Format: 8 digits + 2
// check digits.
var (
	prAllowedChars       = regexp.MustCompile(`^[\d.\-\s]+$`)
	prFirstDigitWeights  = []int{3, 2, 7, 6, 5, 4, 3, 2}
	prSecondDigitWeights = []int{4, 3, 2, 7, 6, 5, 4, 3, 2}
)

func prNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func prIsValid(value string) bool {
	if !prAllowedChars.MatchString(value) {
		return false
	}

	v := prNormalize(value)

	if len(v) != 10 {
		return false
	}

	base := v[:8]
	firstDigit := shared.Mod11CheckDigit(shared.WeightedSum(base, prFirstDigitWeights))

	if firstDigit != int(v[8]-'0') {
		return false
	}

	secondDigit := shared.Mod11CheckDigit(shared.WeightedSum(base+strconv.Itoa(firstDigit), prSecondDigitWeights))

	return secondDigit == int(v[9]-'0')
}

func prFormat(value string) string {
	v := prNormalize(value)

	if len(v) != 10 {
		return value
	}

	return v[:3] + "." + v[3:8] + "-" + v[8:10]
}
