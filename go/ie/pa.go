package ie

import (
	"regexp"

	"github.com/matheuslm7/brazil-validator/go/internal/shared"
)

// Verified against the official SEFAZ-PA "Roteiro de Crítica da Inscrição
// Estadual" (sintegra.gov.br/Cad_Estados/cad_PA.html), including its two
// worked examples (15999999-5, 75000002-3). Format: 8 digits (always
// starting with 15, 75, 76, 77, 78 or 79) + 1 check digit.
var (
	paAllowedChars = regexp.MustCompile(`^[\d\-\s]+$`)
	paWeights      = []int{9, 8, 7, 6, 5, 4, 3, 2}
	paValidPrefix  = map[string]bool{"15": true, "75": true, "76": true, "77": true, "78": true, "79": true}
)

func paNormalize(value string) string {
	return shared.RemoveNonDigits(value)
}

func paIsValid(value string) bool {
	if !paAllowedChars.MatchString(value) {
		return false
	}

	v := paNormalize(value)

	if len(v) != 9 || !paValidPrefix[v[:2]] {
		return false
	}

	return shared.Mod11CheckDigit(shared.WeightedSum(v, paWeights)) == int(v[8]-'0')
}

func paFormat(value string) string {
	v := paNormalize(value)

	if len(v) != 9 {
		return value
	}

	return v[:8] + "-" + v[8:9]
}
