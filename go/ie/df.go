package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// SEFAZ-DF's own Sintegra "Roteiro de Crítica" page
// (sintegra.gov.br/Cad_Estados/cad_DF.html) is empty, so this was instead
// cross-verified against two independent secondary sources that agree with
// each other (cadcobol.com.br's fully worked example, arithmetic re-checked
// by hand, and mestredocalculo.com.br independently citing the same valid
// example "07.300.001.001-09"). The algorithm is structurally identical to
// AC's officially-confirmed one (same weight sequences), differing only in
// the fixed "07" prefix — strong evidence both derive from the same
// original SEFAZ documentation. Format: "07" (fixed) + 6 sequence digits +
// 3 "ordem do estabelecimento" digits (001 = matriz) + 2 check digits = 13
// digits total.
var (
	dfAllowedChars       = regexp.MustCompile(`^[\d./\-\s]+$`)
	dfFirstDigitWeights  = []int{4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
	dfSecondDigitWeights = []int{5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
)

func dfNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func dfIsValid(value string) bool {
	if !dfAllowedChars.MatchString(value) {
		return false
	}

	v := dfNormalize(value)

	if len(v) != 13 || v[:2] != "07" {
		return false
	}

	firstDigit := shared.Mod11CheckDigit(shared.WeightedSum(v, dfFirstDigitWeights))
	if firstDigit != int(v[11]-'0') {
		return false
	}

	secondDigit := shared.Mod11CheckDigit(shared.WeightedSum(v, dfSecondDigitWeights))

	return secondDigit == int(v[12]-'0')
}

func dfFormat(value string) string {
	v := dfNormalize(value)

	if len(v) != 13 {
		return value
	}

	return v[:2] + "." + v[2:5] + "." + v[5:8] + "." + v[8:11] + "-" + v[11:13]
}
