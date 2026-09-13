package ie

import (
	"regexp"
	"strconv"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-MG "Roteiro de Crítica da Inscrição
// Estadual" (mirrored at sintegra.gov.br/Cad_Estados/cad_MG.html), including
// its fully worked example (062.307.904/0081).
//
// Format: A1A2A3 B1B2B3B4B5B6 C1C2 D1D2 (13 digits), where A = município
// code, B = registration number, C = establishment order, D = check digits.
var (
	mgAllowedChars       = regexp.MustCompile(`^[\d./\s]+$`)
	mgFirstDigitWeights  = []int{1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2}
	mgSecondDigitWeights = []int{3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2}
)

func mgNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func mgSumOfDigits(value int) int {
	sum := 0

	for _, c := range strconv.Itoa(value) {
		sum += int(c - '0')
	}

	return sum
}

// mgCalculateFirstDigit equalizes the field widths by inserting a "0" right
// after the município code, then sums the *digits* of each weighted
// product (not the products themselves) before completing to the next
// multiple of ten.
func mgCalculateFirstDigit(base string) int {
	withInsertedZero := base[:3] + "0" + base[3:]

	digitSum := 0

	for i, w := range mgFirstDigitWeights {
		digitSum += mgSumOfDigits(int(withInsertedZero[i]-'0') * w)
	}

	remainder := digitSum % 10

	if remainder == 0 {
		return 0
	}

	return 10 - remainder
}

// mgCalculateSecondDigit uses the original (un-padded) base plus D1, and
// sums the weighted products directly, following the general módulo 11
// remainder rule.
func mgCalculateSecondDigit(base string, firstDigit int) int {
	withFirstDigit := base + strconv.Itoa(firstDigit)

	sum := shared.WeightedSum(withFirstDigit, mgSecondDigitWeights)
	remainder := sum % 11

	if remainder <= 1 {
		return 0
	}

	return 11 - remainder
}

func mgIsValid(value string) bool {
	if !mgAllowedChars.MatchString(value) {
		return false
	}

	v := mgNormalize(value)

	if len(v) != 13 {
		return false
	}

	base := v[:11]
	firstDigit := mgCalculateFirstDigit(base)

	if firstDigit != int(v[11]-'0') {
		return false
	}

	secondDigit := mgCalculateSecondDigit(base, firstDigit)

	return secondDigit == int(v[12]-'0')
}

func mgFormat(value string) string {
	v := mgNormalize(value)

	if len(v) != 13 {
		return value
	}

	return v[:3] + "." + v[3:6] + "." + v[6:9] + "/" + v[9:13]
}
