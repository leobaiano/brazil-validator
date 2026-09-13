// Package pix validates, normalizes, and formats PIX keys (CPF, CNPJ,
// e-mail, phone, or random key).
package pix

import (
	"regexp"
	"strings"

	"github.com/matheuslm7/brazil-validator/go/cnpj"
	"github.com/matheuslm7/brazil-validator/go/cpf"
	"github.com/matheuslm7/brazil-validator/go/email"
	"github.com/matheuslm7/brazil-validator/go/internal/shared"
	"github.com/matheuslm7/brazil-validator/go/phone"
)

// KeyType identifies which kind of PIX key a value looks like.
type KeyType string

const (
	CPFKey   KeyType = "CPF"
	CNPJKey  KeyType = "CNPJ"
	EmailKey KeyType = "EMAIL"
	PhoneKey KeyType = "PHONE"
	EVPKey   KeyType = "EVP"
)

// Formats verified against Bacen's official DICT schema
// (github.com/bacen/pix-dict-api openapi.yaml) and the Manual de Padrões
// para Iniciação do Pix:
//   - CPF/CNPJ keys are digits-only (^[0-9]{11}$ / ^[0-9]{14}$). The DICT
//     schema does not yet accept alphanumeric CNPJ as a key.
//   - The EVP (random key) is a canonical, case-insensitive UUID (8-4-4-4-12).
//   - Phone keys use the international format "+55AANNNNNNNNN", where AA is
//     the DDD and NNNNNNNNN is a 9-digit mobile number — Brazilian Pix only
//     registers Brazilian mobile numbers, so the country code is fixed at 55.
//   - Email keys are case-insensitive and capped at 77 characters.
var (
	evpRegex     = regexp.MustCompile(`(?i)^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`)
	cpfShape     = regexp.MustCompile(`^\d{11}$`)
	cnpjShape    = regexp.MustCompile(`^\d{14}$`)
	phoneChars   = regexp.MustCompile(`^[\d\s()+-]+$`)
	phoneKeyForm = regexp.MustCompile(`^\+55\d{11}$`)
)

const maxEmailKeyLength = 77

// GetKeyType detects which kind of PIX key value looks like, or an empty
// KeyType if it matches none of the known shapes.
func GetKeyType(value string) KeyType {
	trimmed := strings.TrimSpace(value)

	switch {
	case evpRegex.MatchString(trimmed):
		return EVPKey
	case strings.Contains(trimmed, "@"):
		return EmailKey
	case strings.HasPrefix(trimmed, "+"):
		return PhoneKey
	case cpfShape.MatchString(trimmed):
		return CPFKey
	case cnpjShape.MatchString(trimmed):
		return CNPJKey
	default:
		return ""
	}
}

func normalizePhoneKey(value string) string {
	return "+" + shared.RemoveNonDigits(value)
}

func isValidPhoneKey(value string) bool {
	if !phoneChars.MatchString(value) {
		return false
	}

	p := normalizePhoneKey(value)

	if !phoneKeyForm.MatchString(p) {
		return false
	}

	ddd := p[3:5]
	subscriberFirstDigit := p[5]

	return shared.ValidDDDs[ddd] && subscriberFirstDigit == '9'
}

func formatPhoneKey(value string) string {
	p := normalizePhoneKey(value)

	if !phoneKeyForm.MatchString(p) {
		return value
	}

	return "+55 " + phone.Format(p[3:])
}

// IsValid reports whether value is a valid PIX key of any recognized type.
func IsValid(value string) bool {
	keyType := GetKeyType(value)

	if keyType == "" {
		return false
	}

	trimmed := strings.TrimSpace(value)

	switch keyType {
	case CPFKey:
		return cpf.IsValid(trimmed)
	case CNPJKey:
		return cnpj.IsValid(trimmed)
	case EmailKey:
		return len(trimmed) <= maxEmailKeyLength && email.IsValid(trimmed)
	case PhoneKey:
		return isValidPhoneKey(trimmed)
	case EVPKey:
		return true
	default:
		return false
	}
}

// Normalize dispatches to the canonical normalize rule of value's detected
// key type. If the type cannot be detected, value is returned unchanged.
func Normalize(value string) string {
	keyType := GetKeyType(value)

	if keyType == "" {
		return value
	}

	trimmed := strings.TrimSpace(value)

	switch keyType {
	case CPFKey:
		return cpf.Normalize(trimmed)
	case CNPJKey:
		return cnpj.Normalize(trimmed)
	case EmailKey:
		return email.Normalize(trimmed)
	case PhoneKey:
		return normalizePhoneKey(trimmed)
	case EVPKey:
		return strings.ToLower(trimmed)
	default:
		return value
	}
}

// Format dispatches to the canonical format rule of value's detected key
// type. If the type cannot be detected, value is returned unchanged.
func Format(value string) string {
	keyType := GetKeyType(value)

	if keyType == "" {
		return value
	}

	trimmed := strings.TrimSpace(value)

	switch keyType {
	case CPFKey:
		return cpf.Format(trimmed)
	case CNPJKey:
		return cnpj.Format(trimmed)
	case EmailKey:
		return email.Format(trimmed)
	case PhoneKey:
		return formatPhoneKey(trimmed)
	case EVPKey:
		return strings.ToLower(trimmed)
	default:
		return value
	}
}
