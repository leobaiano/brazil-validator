package phone_test

import (
	"testing"

	"github.com/matheuslm7/brazil-validator/go/phone"
)

func TestIsValid(t *testing.T) {
	valid := []string{
		"(11) 91234-5678",
		"11912345678",
		"(11) 2345-6789",
		"1123456789",
		"(21) 2345-6789",
		"11987654321",
		"8534567890",
	}

	for _, v := range valid {
		if !phone.IsValid(v) {
			t.Errorf("IsValid(%q) = false, want true", v)
		}
	}

	invalid := []string{
		"(00) 91234-5678",
		"(20) 1234-5678",
		"(29) 91234-5678",
		"11812345678",
		"1161234567",
		"1191234567",
		"111234567",
		"119123456789",
		"(11) 9ABC-5678",
		"11+91234-5678",
		"",
		"        ",
		"1234",
		"11a12345678",
		"119123456789012",
	}

	for _, v := range invalid {
		if phone.IsValid(v) {
			t.Errorf("IsValid(%q) = true, want false", v)
		}
	}
}

func TestNormalize(t *testing.T) {
	cases := map[string]string{
		"(11) 91234-5678": "11912345678",
		"(11) 2345-6789":  "1123456789",
		"11912345678":     "11912345678",
	}

	for input, want := range cases {
		if got := phone.Normalize(input); got != want {
			t.Errorf("Normalize(%q) = %q, want %q", input, got, want)
		}
	}
}

func TestFormat(t *testing.T) {
	cases := map[string]string{
		"11912345678":     "(11) 91234-5678",
		"1123456789":      "(11) 2345-6789",
		"(11) 91234-5678": "(11) 91234-5678",
		"123":             "123",
	}

	for input, want := range cases {
		if got := phone.Format(input); got != want {
			t.Errorf("Format(%q) = %q, want %q", input, got, want)
		}
	}
}
