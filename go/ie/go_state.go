package ie

import (
	"regexp"
	"strconv"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-GO "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_GO.html), including its worked
// example (10.987.654-7). Format: AB.CDE.FGH-I, where AB must be 10, 11, or
// 20-29.
var (
	goAllowedChars = regexp.MustCompile(`^[\d.\-\s]+$`)
	goWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
)

func goHasValidPrefix(v string) bool {
	prefix, err := strconv.Atoi(v[:2])
	if err != nil {
		return false
	}

	return prefix == 10 || prefix == 11 || (prefix >= 20 && prefix <= 29)
}

func goNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func goIsValid(value string) bool {
	if !goAllowedChars.MatchString(value) {
		return false
	}

	v := goNormalize(value)

	if len(v) != 9 || !goHasValidPrefix(v) {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, goWeights)) == int(v[8]-'0')
}

func goFormat(value string) string {
	v := goNormalize(value)

	if len(v) != 9 {
		return value
	}

	return v[:2] + "." + v[2:5] + "." + v[5:8] + "-" + v[8:9]
}
