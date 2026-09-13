package ie

import (
	"regexp"
	"strconv"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-PE "Roteiro de Crítica da Inscrição
// Estadual" for the e-Fisco system (sintegra.gov.br/Cad_Estados/cad_PE.html),
// including its fully worked example (0321418-40). Format: 7 digits + 2
// check digits.
var (
	peAllowedChars       = regexp.MustCompile(`^[\d\-\s]+$`)
	peFirstDigitWeights  = []int{8, 7, 6, 5, 4, 3, 2}
	peSecondDigitWeights = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func peNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func peIsValid(value string) bool {
	if !peAllowedChars.MatchString(value) {
		return false
	}

	v := peNormalize(value)

	if len(v) != 9 {
		return false
	}

	base := v[:7]
	firstDigit := shared.Mod11CheckDigit(shared.WeightedSum(base, peFirstDigitWeights))

	if firstDigit != int(v[7]-'0') {
		return false
	}

	secondDigit := shared.Mod11CheckDigit(shared.WeightedSum(base+strconv.Itoa(firstDigit), peSecondDigitWeights))

	return secondDigit == int(v[8]-'0')
}

func peFormat(value string) string {
	v := peNormalize(value)

	if len(v) != 9 {
		return value
	}

	return v[:7] + "-" + v[7:9]
}
