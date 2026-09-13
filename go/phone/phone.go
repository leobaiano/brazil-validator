// Package phone validates, normalizes, and formats Brazilian national phone
// numbers (mobile and landline, no +55 country code).
package phone

import (
	"regexp"
	"strings"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

var allowedChars = regexp.MustCompile(`^[\d\s()-]+$`)

// Normalize strips formatting and returns the canonical (digits-only)
// representation of value.
func Normalize(value string) string {
	return shared.RemoveNonDigits(value)
}

// IsValid reports whether value is a structurally valid Brazilian phone
// number. It enforces Anatel's numbering plan: the DDD must be one of the
// 67 codes actually assigned, mobile numbers (11 digits) must carry the
// "ninth digit" 9 (Resolução nº 553/2010), and landline numbers (10 digits)
// must start with 2-5.
func IsValid(value string) bool {
	if !allowedChars.MatchString(value) {
		return false
	}

	phone := Normalize(value)

	if len(phone) != 10 && len(phone) != 11 {
		return false
	}

	ddd := phone[:2]

	if !shared.ValidDDDs[ddd] {
		return false
	}

	subscriberFirstDigit := phone[2]

	if len(phone) == 11 {
		return subscriberFirstDigit == '9'
	}

	return strings.ContainsRune("2345", rune(subscriberFirstDigit))
}

// Format returns value in its standard human-readable representation
// (XX) XXXXX-XXXX for mobile or (XX) XXXX-XXXX for landline. If the
// normalized value has an invalid length, value is returned unchanged.
func Format(value string) string {
	phone := Normalize(value)

	switch len(phone) {
	case 11:
		return "(" + phone[:2] + ") " + phone[2:7] + "-" + phone[7:11]
	case 10:
		return "(" + phone[:2] + ") " + phone[2:6] + "-" + phone[6:10]
	default:
		return value
	}
}
