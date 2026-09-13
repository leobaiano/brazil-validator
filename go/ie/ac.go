package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-AC "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_AC.html), including its worked
// example (01.004.823/001-12). Format: 11 digits (always starting with "01")
// + 2 check digits.
var (
	acAllowedChars       = regexp.MustCompile(`^[\d./\-\s]+$`)
	acFirstDigitWeights  = []int{4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
	acSecondDigitWeights = []int{5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
)

func acNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func acIsValid(value string) bool {
	if !acAllowedChars.MatchString(value) {
		return false
	}

	v := acNormalize(value)

	if len(v) != 13 || v[:2] != "01" {
		return false
	}

	firstDigit := shared.Mod11CheckDigit(shared.WeightedSum(v, acFirstDigitWeights))
	if firstDigit != int(v[11]-'0') {
		return false
	}

	secondDigit := shared.Mod11CheckDigit(shared.WeightedSum(v, acSecondDigitWeights))

	return secondDigit == int(v[12]-'0')
}

func acFormat(value string) string {
	v := acNormalize(value)

	if len(v) != 13 {
		return value
	}

	return v[:2] + "." + v[2:5] + "." + v[5:8] + "/" + v[8:11] + "-" + v[11:13]
}
