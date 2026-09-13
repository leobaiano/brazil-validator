package ie_test

import (
	"strconv"
	"testing"

	"github.com/matheuslm7/br-validator/go/ie"
)

type vector struct {
	uf    string
	value string
}

// Every value below is either the exact worked example published by the
// state's own SEFAZ "Roteiro de Crítica da Inscrição Estadual" (mirrored at
// sintegra.gov.br/Cad_Estados/cad_XX.html), or, where the source describes
// the algorithm without a numeric example (RJ's weights, MG's second
// vector, MS), a value independently hand-computed against that same
// official algorithm. DF is the one exception: sintegra.gov.br's own DF
// page is empty, so its vector instead comes from two independent
// secondary sources that agree with each other and whose arithmetic was
// re-checked by hand (see df.go for details). This mirrors the same
// vectors used by the TypeScript implementation's test suite, so both
// ports are checked against the same regression data.
var officialVectors = []vector{
	{"SP", "110042490114"},
	{"RJ", "99999993"},
	{"RJ", "12345674"},
	{"MG", "0623079040081"},
	{"MG", "3131234560089"},
	{"AC", "0100482300112"},
	{"AL", "240000048"},
	{"AM", "999999990"},
	{"AP", "030123459"},
	{"BA", "12345663"},
	{"BA", "61234557"},
	{"BA", "100000306"},
	{"CE", "060000015"},
	{"ES", "999999990"},
	{"GO", "109876547"},
	{"MA", "120000385"},
	{"MS", "281234566"},
	{"MT", "00130000019"},
	{"PA", "159999995"},
	{"PA", "750000023"},
	{"PB", "060000015"},
	{"PE", "032141840"},
	{"PI", "012345679"},
	{"PR", "1234567850"},
	{"RN", "200400401"},
	{"RN", "2000400400"},
	{"RO", "00000000625213"},
	{"RR", "240061536"},
	{"RR", "240066281"},
	{"RR", "240017556"},
	{"RR", "240034290"},
	{"RR", "240013603"},
	{"RR", "240082668"},
	{"RR", "240073562"},
	{"RR", "240054674"},
	{"RR", "240041455"},
	{"RR", "240013407"},
	{"RS", "2243658792"},
	{"SC", "251040852"},
	{"SE", "271234563"},
	{"TO", "29010227836"},
	{"DF", "0730000100109"},
}

func flipLastDigit(value string) string {
	last, _ := strconv.Atoi(string(value[len(value)-1]))

	return value[:len(value)-1] + strconv.Itoa((last+1)%10)
}

func TestOfficialVectorsAreValid(t *testing.T) {
	for _, v := range officialVectors {
		if !ie.IsValid(v.value, v.uf) {
			t.Errorf("IsValid(%q, %q) = false, want true", v.value, v.uf)
		}
	}
}

func TestTamperedOfficialVectorsAreInvalid(t *testing.T) {
	for _, v := range officialVectors {
		tampered := flipLastDigit(v.value)
		if ie.IsValid(tampered, v.uf) {
			t.Errorf("IsValid(%q, %q) = true, want false (tampered check digit)", tampered, v.uf)
		}
	}
}

func TestFormattedOfficialExamples(t *testing.T) {
	cases := []struct {
		value string
		uf    string
	}{
		{"110.042.490.114", "SP"},
		{"99.999.99-3", "RJ"},
		{"062.307.904/0081", "MG"},
		{"01.004.823/001-12", "AC"},
		{"99.999.999-0", "AM"},
		{"123456-63", "BA"},
		{"612345-57", "BA"},
		{"1000003-06", "BA"},
		{"06000001-5", "CE"},
		{"10.987.654-7", "GO"},
		{"0013000001-9", "MT"},
		{"15999999-5", "PA"},
		{"75000002-3", "PA"},
		{"0321418-40", "PE"},
		{"123.45678-50", "PR"},
		{"20.040.040-1", "RN"},
		{"20.0.040.040-0", "RN"},
		{"0000000062521-3", "RO"},
		{"24006153-6", "RR"},
		{"224/3658792", "RS"},
		{"251.040.852", "SC"},
		{"27123456-3", "SE"},
		{"07.300.001.001-09", "DF"},
		{"P-01100424.3/002", "SP"},
	}

	for _, c := range cases {
		if !ie.IsValid(c.value, c.uf) {
			t.Errorf("IsValid(%q, %q) = false, want true", c.value, c.uf)
		}
	}
}

func TestPrefixAndTypeConstraints(t *testing.T) {
	invalid := []vector{
		{"AC", "0200482300112"}, // must start with 01
		{"AL", "241000048"},     // invalid tipo de empresa digit
		{"AP", "040123459"},     // must start with 03
		{"GO", "159876547"},     // invalid prefix
		{"MS", "291234566"},     // invalid prefix
		{"PA", "169999995"},     // invalid prefix
		{"RN", "210400401"},     // must start with 20
		{"RR", "230061536"},     // must start with 24
		{"TO", "29040227836"},   // invalid tipo code
		{"DF", "0830000100109"}, // must start with 07
	}

	for _, v := range invalid {
		if ie.IsValid(v.value, v.uf) {
			t.Errorf("IsValid(%q, %q) = true, want false", v.value, v.uf)
		}
	}
}

func TestProdutorRural(t *testing.T) {
	if !ie.IsValid("P-01100424.3/002", "SP") {
		t.Error("Produtor Rural example should be valid")
	}

	if !ie.IsValid("p-01100424.3/002", "SP") {
		t.Error("lowercase p should be accepted")
	}

	if ie.IsValid("P-01100424.4/002", "SP") {
		t.Error("wrong check digit should be rejected")
	}

	if ie.IsValid("P-11100424.3/002", "SP") {
		t.Error("missing fixed '0' after P should be rejected")
	}

	if got := ie.Normalize("p-01100424.3/002", "SP"); got != "P011004243002" {
		t.Errorf("Normalize() = %q, want %q", got, "P011004243002")
	}

	if got := ie.Format("P011004243002", "SP"); got != "P-01100424.3/002" {
		t.Errorf("Format() = %q, want %q", got, "P-01100424.3/002")
	}
}

func TestUnsupportedUF(t *testing.T) {
	if ie.IsValid("110042490114", "XX") {
		t.Error("nonexistent UF should be invalid")
	}

	if got := ie.Normalize("110042490114", "XX"); got != "110042490114" {
		t.Errorf("Normalize() for unsupported UF = %q, want unchanged input", got)
	}

	if got := ie.Format("110042490114", "XX"); got != "110042490114" {
		t.Errorf("Format() for unsupported UF = %q, want unchanged input", got)
	}
}

func TestNormalizeAndFormat(t *testing.T) {
	cases := []struct {
		uf         string
		formatted  string
		normalized string
	}{
		{"SP", "110.042.490.114", "110042490114"},
		{"RJ", "99.999.99-3", "99999993"},
		{"MG", "062.307.904/0081", "0623079040081"},
		{"BA", "123456-63", "12345663"},
		{"RS", "224/3658792", "2243658792"},
		{"DF", "07.300.001.001-09", "0730000100109"},
	}

	for _, c := range cases {
		if got := ie.Normalize(c.formatted, c.uf); got != c.normalized {
			t.Errorf("Normalize(%q, %q) = %q, want %q", c.formatted, c.uf, got, c.normalized)
		}

		if got := ie.Format(c.normalized, c.uf); got != c.formatted {
			t.Errorf("Format(%q, %q) = %q, want %q", c.normalized, c.uf, got, c.formatted)
		}
	}

	if got := ie.Format("123", "SP"); got != "123" {
		t.Errorf("Format() with invalid length = %q, want unchanged input", got)
	}
}
