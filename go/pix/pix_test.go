package pix_test

import (
	"testing"

	"github.com/matheuslm7/brazil-validator/go/pix"
)

func TestGetKeyType(t *testing.T) {
	cases := map[string]pix.KeyType{
		"52998224725":                          pix.CPFKey,
		"11222333000181":                       pix.CNPJKey,
		"user@example.com":                     pix.EmailKey,
		"+5511987654321":                       pix.PhoneKey,
		"123e4567-e89b-12d3-a456-426655440000": pix.EVPKey,
		"not-a-pix-key":                        "",
	}

	for input, want := range cases {
		if got := pix.GetKeyType(input); got != want {
			t.Errorf("GetKeyType(%q) = %q, want %q", input, got, want)
		}
	}
}

func TestIsValid(t *testing.T) {
	valid := []string{
		"52998224725",
		"11222333000181",
		"user@example.com",
		"User@Example.COM",
		"+5511987654321",
		"+55 (11) 98765-4321",
		"123e4567-e89b-12d3-a456-426655440000",
		"123E4567-E89B-12D3-A456-426655440000",
	}

	for _, v := range valid {
		if !pix.IsValid(v) {
			t.Errorf("IsValid(%q) = false, want true", v)
		}
	}

	invalid := []string{
		"529.982.247-25",
		"52998224700",
		"12ABC34501DE35",
		"11987654321",
		"+5500987654321",
		"+551187654321",
		"123456789",
		"123e4567-e89b-12d3-426655440000",
		"not a pix key!!",
		"",
	}

	for _, v := range invalid {
		if pix.IsValid(v) {
			t.Errorf("IsValid(%q) = true, want false", v)
		}
	}
}

func TestNormalize(t *testing.T) {
	cases := map[string]string{
		"52998224725":                          "52998224725",
		"User@Example.COM":                     "user@example.com",
		"+55 (11) 98765-4321":                  "+5511987654321",
		"123E4567-E89B-12D3-A456-426655440000": "123e4567-e89b-12d3-a456-426655440000",
		"not-a-pix-key":                        "not-a-pix-key",
	}

	for input, want := range cases {
		if got := pix.Normalize(input); got != want {
			t.Errorf("Normalize(%q) = %q, want %q", input, got, want)
		}
	}
}

func TestFormat(t *testing.T) {
	cases := map[string]string{
		"52998224725":                          "529.982.247-25",
		"11222333000181":                       "11.222.333/0001-81",
		"User@Example.COM":                     "user@example.com",
		"+5511987654321":                       "+55 (11) 98765-4321",
		"123E4567-E89B-12D3-A456-426655440000": "123e4567-e89b-12d3-a456-426655440000",
		"not-a-pix-key":                        "not-a-pix-key",
	}

	for input, want := range cases {
		if got := pix.Format(input); got != want {
			t.Errorf("Format(%q) = %q, want %q", input, got, want)
		}
	}
}
