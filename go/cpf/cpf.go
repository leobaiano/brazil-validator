// Package cpf validates, normalizes, and formats Brazilian CPF numbers.
package cpf

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

var allowedChars = regexp.MustCompile(`^[\d.\-\s]+$`)

// isAllSameDigit reports whether every character in value is the same
// digit (e.g. "11111111111"). Go's RE2 engine has no backreferences, so
// this can't be expressed as a single regexp like the TypeScript version.
func isAllSameDigit(value string) bool {
	for i := 1; i < len(value); i++ {
		if value[i] != value[0] {
			return false
		}
	}

	return true
}

// Normalize strips formatting and returns the canonical (digits-only)
// representation of value.
func Normalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func calculateCheckDigit(cpf string, weight int) int {
	sum := 0

	for i := 0; i < len(cpf); i++ {
		sum += int(cpf[i]-'0') * (weight - i)
	}

	remainder := (sum * 10) % 11

	if remainder == 10 {
		remainder = 0
	}

	return remainder
}

// IsValid reports whether value is a structurally and check-digit valid
// CPF. It accepts raw or formatted input but rejects unexpected characters.
func IsValid(value string) bool {
	if !allowedChars.MatchString(value) {
		return false
	}

	cpf := Normalize(value)

	if len(cpf) != 11 {
		return false
	}

	if isAllSameDigit(cpf) {
		return false
	}

	firstDigit := calculateCheckDigit(cpf[:9], 10)
	if firstDigit != int(cpf[9]-'0') {
		return false
	}

	secondDigit := calculateCheckDigit(cpf[:10], 11)

	return secondDigit == int(cpf[10]-'0')
}

// Format returns value in its standard human-readable representation
// (XXX.XXX.XXX-XX). If the normalized value has an invalid length, value is
// returned unchanged.
func Format(value string) string {
	cpf := Normalize(value)

	if len(cpf) != 11 {
		return value
	}

	return cpf[:3] + "." + cpf[3:6] + "." + cpf[6:9] + "-" + cpf[9:11]
}
