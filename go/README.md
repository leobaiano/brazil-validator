# br-validator (Go)

A validation, normalization, and formatting package for Brazilian data: CPF, CNPJ, CEP, phone numbers, e-mail, PIX keys, and Inscrição Estadual.

This is the Go port of the [TypeScript implementation](../README.md), replicating the same officially-verified rules. Every package follows the same conceptual API:

```go
package.IsValid(value string) bool
package.Normalize(value string) string
package.Format(value string) string
```

`IE` extends this with a second `uf` argument (the check-digit algorithm is defined per state, not nationally), and `PIX` additionally exposes `GetKeyType`.

## Installation

```bash
go get github.com/matheuslm7/br-validator/go
```

## Usage

```go
import (
	"github.com/matheuslm7/br-validator/go/cpf"
	"github.com/matheuslm7/br-validator/go/cnpj"
	"github.com/matheuslm7/br-validator/go/ie"
	"github.com/matheuslm7/br-validator/go/pix"
)

cpf.IsValid("529.982.247-25")      // true
cpf.Format("52998224725")          // "529.982.247-25"

cnpj.IsValid("11.222.333/0001-81") // true

ie.IsValid("110.042.490.114", "SP") // true

pix.GetKeyType("+5511987654321")    // pix.PhoneKey
```

## Packages

| Package | Notes |
| --- | --- |
| `cpf` | |
| `cnpj` | Numeric and alphanumeric |
| `cep` | |
| `phone` | National numbers only, no `+55` |
| `email` | `Format` returns the same value as `Normalize` (no visual mask) |
| `pix` | `KeyType` constants: `CPFKey`, `CNPJKey`, `EmailKey`, `PhoneKey`, `EVPKey` |
| `ie` | All 27 states/DF; `IsValid`/`Normalize`/`Format` take `(value, uf string)` |

See the [main README](../README.md) for the full behavior reference (official sources, normalize/format rules per validator, known gaps) — it applies identically here.

## Conformance

`go/conformance` tests this implementation against [`specification/`](../specification), the language-independent test vectors generated from the TypeScript implementation. If those tests pass, this port behaves identically to TypeScript for every vector on file.

## Development

```bash
go build ./...
go vet ./...
gofmt -l .   # should print nothing
go test ./...
```
