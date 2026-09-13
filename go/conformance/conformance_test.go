// Package conformance checks this Go implementation against
// specification/*/vectors.json, the language-independent test vectors
// generated from the TypeScript implementation. If this passes, the Go
// port behaves identically to TypeScript for every vector on file.
package conformance

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/matheuslm7/br-validator/go/cep"
	"github.com/matheuslm7/br-validator/go/cnpj"
	"github.com/matheuslm7/br-validator/go/cpf"
	"github.com/matheuslm7/br-validator/go/email"
	"github.com/matheuslm7/br-validator/go/ie"
	"github.com/matheuslm7/br-validator/go/phone"
	"github.com/matheuslm7/br-validator/go/pix"
)

type simpleVector struct {
	Input      string `json:"input"`
	Valid      bool   `json:"valid"`
	Normalized string `json:"normalized"`
	Formatted  string `json:"formatted"`
}

type ieVector struct {
	Input      string `json:"input"`
	UF         string `json:"uf"`
	Valid      bool   `json:"valid"`
	Normalized string `json:"normalized"`
	Formatted  string `json:"formatted"`
}

type pixVector struct {
	Input      string `json:"input"`
	KeyType    string `json:"keyType"`
	Valid      bool   `json:"valid"`
	Normalized string `json:"normalized"`
	Formatted  string `json:"formatted"`
}

func loadVectors(t *testing.T, name string, out interface{}) {
	t.Helper()

	path := filepath.Join("..", "..", "specification", name, "vectors.json")

	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("reading %s: %v", path, err)
	}

	if err := json.Unmarshal(data, out); err != nil {
		t.Fatalf("parsing %s: %v", path, err)
	}
}

func TestCPF(t *testing.T) {
	var vectors []simpleVector
	loadVectors(t, "cpf", &vectors)

	for _, v := range vectors {
		if got := cpf.IsValid(v.Input); got != v.Valid {
			t.Errorf("IsValid(%q) = %v, want %v", v.Input, got, v.Valid)
		}
		if got := cpf.Normalize(v.Input); got != v.Normalized {
			t.Errorf("Normalize(%q) = %q, want %q", v.Input, got, v.Normalized)
		}
		if got := cpf.Format(v.Input); got != v.Formatted {
			t.Errorf("Format(%q) = %q, want %q", v.Input, got, v.Formatted)
		}
	}
}

func TestCNPJ(t *testing.T) {
	var vectors []simpleVector
	loadVectors(t, "cnpj", &vectors)

	for _, v := range vectors {
		if got := cnpj.IsValid(v.Input); got != v.Valid {
			t.Errorf("IsValid(%q) = %v, want %v", v.Input, got, v.Valid)
		}
		if got := cnpj.Normalize(v.Input); got != v.Normalized {
			t.Errorf("Normalize(%q) = %q, want %q", v.Input, got, v.Normalized)
		}
		if got := cnpj.Format(v.Input); got != v.Formatted {
			t.Errorf("Format(%q) = %q, want %q", v.Input, got, v.Formatted)
		}
	}
}

func TestCEP(t *testing.T) {
	var vectors []simpleVector
	loadVectors(t, "cep", &vectors)

	for _, v := range vectors {
		if got := cep.IsValid(v.Input); got != v.Valid {
			t.Errorf("IsValid(%q) = %v, want %v", v.Input, got, v.Valid)
		}
		if got := cep.Normalize(v.Input); got != v.Normalized {
			t.Errorf("Normalize(%q) = %q, want %q", v.Input, got, v.Normalized)
		}
		if got := cep.Format(v.Input); got != v.Formatted {
			t.Errorf("Format(%q) = %q, want %q", v.Input, got, v.Formatted)
		}
	}
}

func TestPhone(t *testing.T) {
	var vectors []simpleVector
	loadVectors(t, "phone", &vectors)

	for _, v := range vectors {
		if got := phone.IsValid(v.Input); got != v.Valid {
			t.Errorf("IsValid(%q) = %v, want %v", v.Input, got, v.Valid)
		}
		if got := phone.Normalize(v.Input); got != v.Normalized {
			t.Errorf("Normalize(%q) = %q, want %q", v.Input, got, v.Normalized)
		}
		if got := phone.Format(v.Input); got != v.Formatted {
			t.Errorf("Format(%q) = %q, want %q", v.Input, got, v.Formatted)
		}
	}
}

func TestEmail(t *testing.T) {
	var vectors []simpleVector
	loadVectors(t, "email", &vectors)

	for _, v := range vectors {
		if got := email.IsValid(v.Input); got != v.Valid {
			t.Errorf("IsValid(%q) = %v, want %v", v.Input, got, v.Valid)
		}
		if got := email.Normalize(v.Input); got != v.Normalized {
			t.Errorf("Normalize(%q) = %q, want %q", v.Input, got, v.Normalized)
		}
		if got := email.Format(v.Input); got != v.Formatted {
			t.Errorf("Format(%q) = %q, want %q", v.Input, got, v.Formatted)
		}
	}
}

func TestPIX(t *testing.T) {
	var vectors []pixVector
	loadVectors(t, "pix", &vectors)

	for _, v := range vectors {
		wantKeyType := pix.KeyType(v.KeyType)
		if got := pix.GetKeyType(v.Input); got != wantKeyType {
			t.Errorf("GetKeyType(%q) = %q, want %q", v.Input, got, wantKeyType)
		}
		if got := pix.IsValid(v.Input); got != v.Valid {
			t.Errorf("IsValid(%q) = %v, want %v", v.Input, got, v.Valid)
		}
		if got := pix.Normalize(v.Input); got != v.Normalized {
			t.Errorf("Normalize(%q) = %q, want %q", v.Input, got, v.Normalized)
		}
		if got := pix.Format(v.Input); got != v.Formatted {
			t.Errorf("Format(%q) = %q, want %q", v.Input, got, v.Formatted)
		}
	}
}

func TestIE(t *testing.T) {
	var vectors []ieVector
	loadVectors(t, "ie", &vectors)

	for _, v := range vectors {
		if got := ie.IsValid(v.Input, v.UF); got != v.Valid {
			t.Errorf("IsValid(%q, %q) = %v, want %v", v.Input, v.UF, got, v.Valid)
		}
		if got := ie.Normalize(v.Input, v.UF); got != v.Normalized {
			t.Errorf("Normalize(%q, %q) = %q, want %q", v.Input, v.UF, got, v.Normalized)
		}
		if got := ie.Format(v.Input, v.UF); got != v.Formatted {
			t.Errorf("Format(%q, %q) = %q, want %q", v.Input, v.UF, got, v.Formatted)
		}
	}
}
