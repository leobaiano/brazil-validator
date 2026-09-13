// Package shared holds small helpers reused by more than one validator.
// Kept internal: these are implementation details, not part of the public
// API of any validator package.
package shared

import "regexp"

var nonDigits = regexp.MustCompile(`\D`)

// RemoveNonDigits strips every character that is not 0-9.
func RemoveNonDigits(value string) string {
	return nonDigits.ReplaceAllString(value, "")
}
