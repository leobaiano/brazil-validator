package email_test

import (
	"strings"
	"testing"

	"github.com/matheuslm7/brazil-validator/go/email"
)

func TestIsValid(t *testing.T) {
	valid := []string{
		"user@example.com",
		"user@mail.example.com",
		"user+tag@example.com",
		"User@Example.COM",
		"  user@example.com  ",
		"first.last@sub.example.com.br",
		"a@b.co",
	}

	for _, v := range valid {
		if !email.IsValid(v) {
			t.Errorf("IsValid(%q) = false, want true", v)
		}
	}

	invalid := []string{
		"userexample.com",
		"user@example",
		"user@@example.com",
		"us er@example.com",
		"user<>@example.com",
		"",
		"        ",
		"user@.com",
		strings.Repeat("a", 250) + "@example.com",
		strings.Repeat("a", 65) + "@example.com",
	}

	for _, v := range invalid {
		if email.IsValid(v) {
			t.Errorf("IsValid(%q) = true, want false", v)
		}
	}
}

func TestNormalize(t *testing.T) {
	cases := map[string]string{
		"  user@example.com  ": "user@example.com",
		"User@Example.COM":     "user@example.com",
		"user@example.com":     "user@example.com",
	}

	for input, want := range cases {
		if got := email.Normalize(input); got != want {
			t.Errorf("Normalize(%q) = %q, want %q", input, got, want)
		}
	}
}

func TestFormat(t *testing.T) {
	if got := email.Format("  User@Example.COM  "); got != "user@example.com" {
		t.Errorf("Format() = %q, want %q", got, "user@example.com")
	}
}
