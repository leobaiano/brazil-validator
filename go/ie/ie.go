// Package ie validates, normalizes, and formats Brazilian Inscrição
// Estadual numbers.
//
// Inscrição Estadual has no single national rule: each state (SEFAZ)
// defines its own digit count and check-digit algorithm, so every UF is
// modeled as its own file in this package and registered in the states map
// below. A UF absent from that map is simply not supported yet.
package ie

import "strings"

type stateValidator struct {
	isValid   func(string) bool
	normalize func(string) string
	format    func(string) string
}

var states = map[string]stateValidator{
	"AC": {acIsValid, acNormalize, acFormat},
	"AL": {alIsValid, alNormalize, alFormat},
	"AM": {amIsValid, amNormalize, amFormat},
	"AP": {apIsValid, apNormalize, apFormat},
	"BA": {baIsValid, baNormalize, baFormat},
	"CE": {ceIsValid, ceNormalize, ceFormat},
	"DF": {dfIsValid, dfNormalize, dfFormat},
	"ES": {esIsValid, esNormalize, esFormat},
	"GO": {goIsValid, goNormalize, goFormat},
	"MA": {maIsValid, maNormalize, maFormat},
	"MG": {mgIsValid, mgNormalize, mgFormat},
	"MS": {msIsValid, msNormalize, msFormat},
	"MT": {mtIsValid, mtNormalize, mtFormat},
	"PA": {paIsValid, paNormalize, paFormat},
	"PB": {pbIsValid, pbNormalize, pbFormat},
	"PE": {peIsValid, peNormalize, peFormat},
	"PI": {piIsValid, piNormalize, piFormat},
	"PR": {prIsValid, prNormalize, prFormat},
	"RJ": {rjIsValid, rjNormalize, rjFormat},
	"RN": {rnIsValid, rnNormalize, rnFormat},
	"RO": {roIsValid, roNormalize, roFormat},
	"RR": {rrIsValid, rrNormalize, rrFormat},
	"RS": {rsIsValid, rsNormalize, rsFormat},
	"SC": {scIsValid, scNormalize, scFormat},
	"SE": {seIsValid, seNormalize, seFormat},
	"SP": {spIsValid, spNormalize, spFormat},
	"TO": {toIsValid, toNormalize, toFormat},
}

func resolveState(uf string) (stateValidator, bool) {
	state, ok := states[strings.ToUpper(strings.TrimSpace(uf))]

	return state, ok
}

// IsValid reports whether value is a valid Inscrição Estadual for uf.
func IsValid(value, uf string) bool {
	state, ok := resolveState(uf)

	if !ok {
		return false
	}

	return state.isValid(value)
}

// Normalize strips formatting and returns the canonical representation of
// value for uf. If uf is not supported, value is returned unchanged.
func Normalize(value, uf string) string {
	state, ok := resolveState(uf)

	if !ok {
		return value
	}

	return state.normalize(value)
}

// Format returns value in uf's standard human-readable representation. If
// uf is not supported or the normalized value has an invalid length, value
// is returned unchanged.
func Format(value, uf string) string {
	state, ok := resolveState(uf)

	if !ok {
		return value
	}

	return state.format(value)
}
