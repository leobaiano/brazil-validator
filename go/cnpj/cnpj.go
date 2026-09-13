// Package cnpj validates, normalizes, and formats Brazilian CNPJ numbers,
// covering both the traditional numeric format and the alphanumeric format
// introduced by Receita Federal.
package cnpj

import (
	"regexp"
	"strings"
)

var allowedChars = regexp.MustCompile(`^[A-Za-z0-9.\-/\s]+$`)
var formattingChars = regexp.MustCompile(`[.\-/\s]`)
var normalizedShape = regexp.MustCompile(`^[A-Z0-9]{12}\d{2}$`)

// Normalize strips formatting and uppercases value. A digit-only strip
// would destroy alphanumeric CNPJ values, so only separator characters are
// removed.
func Normalize(value string) string {
	return strings.ToUpper(formattingChars.ReplaceAllString(value, ""))
}

func characterValue(c byte) int {
	return int(c) - 48
}

func calculateCheckDigit(value string) int {
	sum := 0
	weight := 6

	if len(value) == 12 {
		weight = 5
	}

	for i := 0; i < len(value); i++ {
		sum += characterValue(value[i]) * weight
		weight--

		if weight == 1 {
			weight = 9
		}
	}

	remainder := sum % 11

	if remainder == 0 || remainder == 1 {
		return 0
	}

	return 11 - remainder
}

// IsValid reports whether value is a structurally and check-digit valid
// CNPJ, numeric or alphanumeric. It accepts raw or formatted input but
// rejects unexpected characters.
func IsValid(value string) bool {
	if !allowedChars.MatchString(value) {
		return false
	}

	cnpj := Normalize(value)

	if !normalizedShape.MatchString(cnpj) {
		return false
	}

	firstDigit := calculateCheckDigit(cnpj[:12])
	if firstDigit != int(cnpj[12]-'0') {
		return false
	}

	secondDigit := calculateCheckDigit(cnpj[:13])

	return secondDigit == int(cnpj[13]-'0')
}

// Format returns value in its standard human-readable representation
// (XX.XXX.XXX/XXXX-XX). If the normalized value has an invalid length,
// value is returned unchanged.
func Format(value string) string {
	cnpj := Normalize(value)

	if len(cnpj) != 14 {
		return value
	}

	return cnpj[:2] + "." + cnpj[2:5] + "." + cnpj[5:8] + "/" + cnpj[8:12] + "-" + cnpj[12:14]
}
