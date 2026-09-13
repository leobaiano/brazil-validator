// Package email validates, normalizes, and formats e-mail addresses.
package email

import (
	"regexp"
	"strings"
)

// Sourced from the WHATWG HTML Living Standard's email state regex (used by
// browsers to validate <input type="email">). All quantifiers are bounded,
// so it cannot suffer catastrophic backtracking.
var emailRegex = regexp.MustCompile(
	`^[a-zA-Z0-9.!#$%&'*+/=?^_` + "`" + `{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$`,
)

const maxEmailLength = 254
const maxLocalPartLength = 64

// Normalize trims whitespace and lowercases value.
func Normalize(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

// IsValid reports whether value is a structurally valid e-mail address,
// per the WHATWG regular expression plus RFC 5321 length limits.
func IsValid(value string) bool {
	email := Normalize(value)

	if len(email) == 0 || len(email) > maxEmailLength {
		return false
	}

	localPart := email
	if i := strings.IndexByte(email, '@'); i >= 0 {
		localPart = email[:i]
	}

	if localPart == "" || len(localPart) > maxLocalPartLength {
		return false
	}

	return emailRegex.MatchString(email)
}

// Format returns the same canonical value as Normalize. Unlike CPF/CNPJ/
// CEP/Phone, an e-mail address has no visual mask to apply.
func Format(value string) string {
	return Normalize(value)
}
