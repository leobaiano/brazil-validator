package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-BA "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_BA.html), including its four
// worked examples (123456-63, 612345-57, 1000003-06 mod-10/mod-11 x
// 8/9-digit variants).
//
// Bahia has two lengths (8 or 9 digits) and, within each, two moduli:
// módulo 10 when the discriminating digit (the 1st digit for 8-digit IEs,
// the 2nd for 9-digit IEs) is one of 0,1,2,3,4,5,8, and módulo 11 when it
// is 6, 7 or 9. The last check digit is calculated first (from the base
// digits alone), then the first check digit is calculated from the base
// plus that digit.
var (
	baAllowedChars = regexp.MustCompile(`^[\d\-\s]+$`)
	baMod10Digits  = map[byte]bool{'0': true, '1': true, '2': true, '3': true, '4': true, '5': true, '8': true}
	baMod11Digits  = map[byte]bool{'6': true, '7': true, '9': true}
)

func baNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func baCheckDigitFor(sum int, useMod11 bool) int {
	if useMod11 {
		return shared.Mod11CheckDigit(sum)
	}

	return shared.Mod10CheckDigit(sum)
}

func baDescendingWeights(length int) []int {
	weights := make([]int, length)
	for i := 0; i < length; i++ {
		weights[i] = length + 1 - i
	}

	return weights
}

func baIsValid(value string) bool {
	if !baAllowedChars.MatchString(value) {
		return false
	}

	v := baNormalize(value)

	if len(v) != 8 && len(v) != 9 {
		return false
	}

	var discriminant byte
	if len(v) == 8 {
		discriminant = v[0]
	} else {
		discriminant = v[1]
	}

	useMod11 := baMod11Digits[discriminant]

	if !useMod11 && !baMod10Digits[discriminant] {
		return false
	}

	baseLength := len(v) - 2
	base := v[:baseLength]
	lastDigit := baCheckDigitFor(shared.WeightedSum(base, baDescendingWeights(baseLength)), useMod11)

	if lastDigit != int(v[len(v)-1]-'0') {
		return false
	}

	baseWithLastDigit := base + string(rune('0'+lastDigit))
	firstDigit := baCheckDigitFor(shared.WeightedSum(baseWithLastDigit, baDescendingWeights(baseLength+1)), useMod11)

	return firstDigit == int(v[len(v)-2]-'0')
}

func baFormat(value string) string {
	v := baNormalize(value)

	if len(v) != 8 && len(v) != 9 {
		return value
	}

	return v[:len(v)-2] + "-" + v[len(v)-2:]
}
