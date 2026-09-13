package cpf_test

import (
	"testing"

	"github.com/matheuslm7/brazil-validator/go/cpf"
)

func TestIsValid(t *testing.T) {
	valid := []string{
		"529.982.247-25",
		"52998224725",
		"529 982 247 25",
		"111.444.777-35",
		"935.411.347-80",
	}

	for _, v := range valid {
		if !cpf.IsValid(v) {
			t.Errorf("IsValid(%q) = false, want true", v)
		}
	}

	invalid := []string{
		"529.982.247-26",
		"111.444.777-36",
		"935.411.347-81",
		"111.111.111-11",
		"123456789",
		"529.982.247-2A",
		"           ",
		"",
		"529abc982xyz247-25",
	}

	for _, v := range invalid {
		if cpf.IsValid(v) {
			t.Errorf("IsValid(%q) = true, want false", v)
		}
	}
}

func TestNormalize(t *testing.T) {
	cases := map[string]string{
		"529.982.247-25": "52998224725",
		"52998224725":    "52998224725",
		"529 982 247 25": "52998224725",
	}

	for input, want := range cases {
		if got := cpf.Normalize(input); got != want {
			t.Errorf("Normalize(%q) = %q, want %q", input, got, want)
		}
	}
}

func TestFormat(t *testing.T) {
	cases := map[string]string{
		"52998224725":    "529.982.247-25",
		"529.982.247-25": "529.982.247-25",
		"123":            "123",
		"529982247":      "529982247",
	}

	for input, want := range cases {
		if got := cpf.Format(input); got != want {
			t.Errorf("Format(%q) = %q, want %q", input, got, want)
		}
	}
}
