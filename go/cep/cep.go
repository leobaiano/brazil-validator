// Package cep validates, normalizes, and formats Brazilian CEP (postal)
// codes.
package cep

import (
	"regexp"

	"github.com/matheuslm7/br-validator/go/internal/shared"
)

var allowedChars = regexp.MustCompile(`^[\d-]+$`)

// Normalize strips formatting and returns the canonical (digits-only)
// representation of value.
func Normalize(value string) string {
	return shared.RemoveNonDigits(value)
}

// IsValid reports whether value is a structurally valid CEP. A CEP has no
// check digit — it is an 8-digit postal routing code (region, sub-region,
// sector, subsector and distribution suffix) defined by Correios — so
// validity here means structural correctness (8 digits), not whether the
// code exists in Correios' address database.
func IsValid(value string) bool {
	if !allowedChars.MatchString(value) {
		return false
	}

	return len(Normalize(value)) == 8
}

// Format returns value in its standard human-readable representation
// (XXXXX-XXX). If the normalized value has an invalid length, value is
// returned unchanged.
func Format(value string) string {
	cep := Normalize(value)

	if len(cep) != 8 {
		return value
	}

	return cep[:5] + "-" + cep[5:8]
}
