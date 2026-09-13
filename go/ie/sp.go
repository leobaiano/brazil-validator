package ie

import (
	"regexp"
	"strings"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

// Verified against the official SEFAZ-SP "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_SP.html), including both of
// its worked examples: the standard industrial/commercial format
// (110.042.490.114) and the "Produtor Rural" format (P-01100424.3/002).
//
// Note: the source restates the Produtor Rural example at the very end as
// "P-011000424.3/002" (14 characters) — this contradicts both the
// document's own "13 caracteres" rule and its worked calculation (which
// sums exactly 8 digits to 91, matching the 13-character form). Treated as
// a typo in the source; the 13-character form is what this module expects.
var (
	spStandardAllowedChars       = regexp.MustCompile(`^[\d.\s]+$`)
	spProdutorRuralAllowed       = regexp.MustCompile(`^[Pp\d.\-/\s]+$`)
	spFormattingChars            = regexp.MustCompile(`[.\-/\s]`)
	spStandardFirstDigitWeights  = []int{1, 3, 4, 5, 6, 7, 8, 10}
	spStandardSecondDigitWeights = []int{3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2}
	spProdutorRuralWeights       = []int{1, 3, 4, 5, 6, 7, 8, 10}
	spProdutorRuralPrefix        = regexp.MustCompile(`^\s*[Pp]`)
)

func spCalculateCheckDigit(digits string, weights []int) int {
	sum := shared.WeightedSum(digits, weights)

	if sum%11 == 10 {
		return 0
	}

	return sum % 11
}

func spIsProdutorRural(value string) bool {
	return spProdutorRuralPrefix.MatchString(value)
}

func spNormalizeStandard(value string) string {
	return shared.RemoveNonDigits(value)
}

func spIsValidStandard(value string) bool {
	if !spStandardAllowedChars.MatchString(value) {
		return false
	}

	v := spNormalizeStandard(value)

	if len(v) != 12 {
		return false
	}

	firstDigit := spCalculateCheckDigit(v, spStandardFirstDigitWeights)
	if firstDigit != int(v[8]-'0') {
		return false
	}

	secondDigit := spCalculateCheckDigit(v, spStandardSecondDigitWeights)

	return secondDigit == int(v[11]-'0')
}

func spFormatStandard(value string) string {
	v := spNormalizeStandard(value)

	if len(v) != 12 {
		return value
	}

	return v[:3] + "." + v[3:6] + "." + v[6:9] + "." + v[9:12]
}

// Format: P0MMMSSSSD000 (13 characters) — "P" (fixed) + "0" (fixed) + 3
// município digits + 4 sequence digits + 1 check digit + 3 unused digits.
func spNormalizeProdutorRural(value string) string {
	return strings.ToUpper(spFormattingChars.ReplaceAllString(value, ""))
}

func spIsValidProdutorRural(value string) bool {
	if !spProdutorRuralAllowed.MatchString(value) {
		return false
	}

	v := spNormalizeProdutorRural(value)

	if len(v) != 13 || v[0] != 'P' || v[1] != '0' {
		return false
	}

	base := v[1:9]
	checkDigit := spCalculateCheckDigit(base, spProdutorRuralWeights)

	return checkDigit == int(v[9]-'0')
}

func spFormatProdutorRural(value string) string {
	v := spNormalizeProdutorRural(value)

	if len(v) != 13 {
		return value
	}

	return "P-" + v[1:9] + "." + v[9:10] + "/" + v[10:13]
}

func spIsValid(value string) bool {
	if spIsProdutorRural(value) {
		return spIsValidProdutorRural(value)
	}

	return spIsValidStandard(value)
}

func spNormalize(value string) string {
	if spIsProdutorRural(value) {
		return spNormalizeProdutorRural(value)
	}

	return spNormalizeStandard(value)
}

func spFormat(value string) string {
	if spIsProdutorRural(value) {
		return spFormatProdutorRural(value)
	}

	return spFormatStandard(value)
}
