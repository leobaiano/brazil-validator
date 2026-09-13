package cep_test

import (
	"testing"

	"github.com/matheuslm7/brazil-validator/go/cep"
)

func TestIsValid(t *testing.T) {
	valid := []string{"01310-100", "01310100", "11111-111", "70002-900", "20040-020"}

	for _, v := range valid {
		if !cep.IsValid(v) {
			t.Errorf("IsValid(%q) = false, want true", v)
		}
	}

	invalid := []string{"0131010", "013101000", "01310-10A", "013abc10-100", "", "        ", "1234", "abcde-fgh"}

	for _, v := range invalid {
		if cep.IsValid(v) {
			t.Errorf("IsValid(%q) = true, want false", v)
		}
	}
}

func TestNormalize(t *testing.T) {
	if got := cep.Normalize("01310-100"); got != "01310100" {
		t.Errorf("Normalize() = %q, want %q", got, "01310100")
	}
}

func TestFormat(t *testing.T) {
	cases := map[string]string{
		"01310100":  "01310-100",
		"01310-100": "01310-100",
		"123":       "123",
	}

	for input, want := range cases {
		if got := cep.Format(input); got != want {
			t.Errorf("Format(%q) = %q, want %q", input, got, want)
		}
	}
}
