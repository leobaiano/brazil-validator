package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-TO "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_TO.html), including its worked
// example (29010227836). Format: 11 digits, where positions 3-4 hold a
// fixed "tipo" code (01 Produtor Rural, 02 Indústria e Comércio, 03
// Empresas Rudimentares, 99 Cadastro Antigo) that is excluded from the
// check-digit calculation, and position 11 is the check digit.
var (
	toAllowedChars   = regexp.MustCompile(`^[\d\s]+$`)
	toWeights        = []int{9, 8, 7, 6, 5, 4, 3, 2}
	toValidTypeCodes = map[string]bool{"01": true, "02": true, "03": true, "99": true}
	// 1-based positions used in the check-digit calculation (positions 3-4
	// are skipped).
	toDigitPositions = []int{1, 2, 5, 6, 7, 8, 9, 10}
)

func toNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func toIsValid(value string) bool {
	if !toAllowedChars.MatchString(value) {
		return false
	}

	v := toNormalize(value)

	if len(v) != 11 || !toValidTypeCodes[v[2:4]] {
		return false
	}

	sum := 0

	for i, pos := range toDigitPositions {
		sum += int(v[pos-1]-'0') * toWeights[i]
	}

	return shared.Mod11CheckDigit(sum) == int(v[10]-'0')
}

func toFormat(value string) string {
	return toNormalize(value)
}
