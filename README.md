# brazil-validator

A validation, normalization, and formatting library for Brazilian data: CPF, CNPJ, CEP, phone numbers, e-mail, PIX keys, and Inscrição Estadual.

*Leia em [português (pt-BR)](./README.pt-BR.md).*

`brazil-validator` is an independent open-source project. It is **not** an official Receita Federal library, nor affiliated with any Brazilian government agency.

## Installation & usage

This repository ships the same validators in more than one language. Pick yours:

### TypeScript / JavaScript

```bash
npm install brazil-validator
```

```ts
import { CPF, CNPJ, CEP, Phone, Email, PIX, IE } from "brazil-validator";

CPF.isValid("529.982.247-25"); // true
CPF.normalize("529.982.247-25"); // "52998224725"
CPF.format("52998224725"); // "529.982.247-25"

CNPJ.isValid("11.222.333/0001-81"); // true
CNPJ.normalize("11.222.333/0001-81"); // "11222333000181"
CNPJ.format("11222333000181"); // "11.222.333/0001-81"

Phone.isValid("(11) 91234-5678"); // true
Email.isValid("user@example.com"); // true
PIX.isValid("+5511987654321"); // true
IE.isValid("110.042.490.114", "SP"); // true
```

The rest of this README documents the TypeScript/JavaScript API in detail (it's the reference implementation — every other language behaves identically, verified against the same [`specification/`](./specification) test vectors).

### Go

Not yet published as a tagged release, but installable directly from this repository (Go modules work over plain git, no registry needed):

```bash
go get github.com/matheuslm7/brazil-validator/go
```

```go
import (
	"github.com/matheuslm7/brazil-validator/go/cpf"
	"github.com/matheuslm7/brazil-validator/go/ie"
)

cpf.IsValid("529.982.247-25")       // true
ie.IsValid("110.042.490.114", "SP") // true
```

Full Go reference: [`go/README.md`](./go).

### Python

Not yet published to PyPI. Install straight from this repository's `python/` subdirectory:

```bash
pip install "brazil-validator @ git+https://github.com/matheuslm7/brazil-validator.git#subdirectory=python"
```

```python
from br_validator import cpf, ie

cpf.is_valid("529.982.247-25")        # True
ie.is_valid("110.042.490.114", "SP")  # True
```

Full Python reference: [`python/README.md`](./python).

### Java

Not yet published to Maven Central. Build and install into your local Maven repository:

```bash
git clone https://github.com/matheuslm7/brazil-validator.git
cd brazil-validator/java
mvn install
```

```java
import io.github.matheuslm7.brvalidator.Cpf;
import io.github.matheuslm7.brvalidator.ie.Ie;

Cpf.isValid("529.982.247-25");       // true
Ie.isValid("110.042.490.114", "SP"); // true
```

Full Java reference: [`java/README.md`](./java).

### Ruby

Not yet published to RubyGems. Add it straight from this repository to your `Gemfile`:

```ruby
gem "brazil-validator", git: "https://github.com/matheuslm7/brazil-validator.git", glob: "ruby/*.gemspec"
```

```ruby
require "br_validator"

BrValidator::Cpf.is_valid?("529.982.247-25")       # true
BrValidator::Ie.is_valid?("110.042.490.114", "SP") # true
```

Full Ruby reference: [`ruby/README.md`](./ruby).

### C#

Not yet published to NuGet. Clone and reference the project directly:

```bash
git clone https://github.com/matheuslm7/brazil-validator.git
dotnet add YourProject.csproj reference brazil-validator/csharp/src/BrValidator/BrValidator.csproj
```

```csharp
using BrValidator;
using BrValidator.Ie;

Cpf.IsValid("529.982.247-25");       // true
Ie.IsValid("110.042.490.114", "SP"); // true
```

Full C# reference: [`csharp/README.md`](./csharp).

## API

Every validator in this library follows the same conceptual pattern:

```ts
Validator.isValid(value: string): boolean
Validator.normalize(value: string): string
Validator.format(value: string): string
```

- **`isValid(value)`** — returns `true` if `value` is a valid identifier. Accepts both raw and formatted input, but rejects unexpected characters (invalid input is never silently sanitized into a valid one).
- **`normalize(value)`** — strips formatting and returns the canonical representation of `value`.
- **`format(value)`** — returns `value` in its standard human-readable representation. If `value` has an invalid length, it is returned unchanged.

Two validators extend this pattern for reasons specific to what they validate:

- **`IE`** (Inscrição Estadual) takes a second `uf` argument — `IE.isValid(value, uf)` — because the check-digit algorithm is defined per state, not nationally.
- **`PIX`** additionally exposes `PIX.getKeyType(value)`, since a PIX key can be a CPF, CNPJ, e-mail, phone, or random key, and callers often need to know which.

## Supported validators

| Validator | Status |
| --- | --- |
| CPF | ✅ Available |
| CNPJ (numeric) | ✅ Available |
| CNPJ (alphanumeric) | ✅ Available |
| CEP | ✅ Available |
| Phone numbers | ✅ Available |
| E-mail | ✅ Available |
| PIX keys | ✅ Available |
| Inscrição Estadual | ✅ Available for all 27 states/DF |

### CPF

```ts
CPF.isValid("529.982.247-25"); // true
CPF.isValid("52998224725"); // true
CPF.isValid("111.111.111-11"); // false (repeated digits)

CPF.normalize("529.982.247-25"); // "52998224725"
CPF.format("52998224725"); // "529.982.247-25"
```

### CNPJ

CNPJ validation covers both the traditional numeric format and the alphanumeric format introduced by Receita Federal.

```ts
// Numeric
CNPJ.isValid("11.222.333/0001-81"); // true
CNPJ.normalize("11.222.333/0001-81"); // "11222333000181"
CNPJ.format("11222333000181"); // "11.222.333/0001-81"

// Alphanumeric
CNPJ.isValid("12.ABC.345/01DE-35"); // true
CNPJ.normalize("12.ABC.345/01DE-35"); // "12ABC34501DE35"
CNPJ.format("12ABC34501DE35"); // "12.ABC.345/01DE-35"
```

Alphanumeric CNPJ uses 12 alphanumeric positions (`A-Z`, `0-9`) followed by 2 numeric check digits, calculated with modulo 11 as specified by Receita Federal's official technical documentation.

### CEP

```ts
CEP.isValid("01310-100"); // true
CEP.isValid("01310100"); // true
CEP.isValid("0131010"); // false (wrong length)

CEP.normalize("01310-100"); // "01310100"
CEP.format("01310100"); // "01310-100"
```

A CEP (Código de Endereçamento Postal) is an 8-digit postal routing code defined by Correios (the Brazilian postal service). Unlike CPF/CNPJ, it has no check digit — validation here checks structure (8 digits) only, not whether the code exists in Correios' address database.

### Phone numbers

```ts
Phone.isValid("(11) 91234-5678"); // true — mobile, with formatting
Phone.isValid("11912345678"); // true — mobile, no formatting
Phone.isValid("(11) 2345-6789"); // true — landline
Phone.isValid("11812345678"); // false — mobile missing the ninth digit "9"

Phone.normalize("(11) 91234-5678"); // "11912345678"
Phone.format("11912345678"); // "(11) 91234-5678"
```

Only national numbers are supported (no `+55` country code). Validation enforces Anatel's numbering plan: the DDD (area code) must be one of the 67 codes actually assigned by Anatel, mobile numbers (11 digits) must carry the "ninth digit" `9` (Resolução nº 553/2010), and landline numbers (10 digits) must start with 2-5.

### E-mail

```ts
Email.isValid("user@example.com"); // true
Email.isValid("user@example"); // false — no domain TLD

Email.normalize("User@Example.COM"); // "user@example.com"
Email.format("User@Example.COM"); // "user@example.com"
```

Validation follows the WHATWG HTML Living Standard's e-mail regular expression (the same one browsers use for `<input type="email">`), plus RFC 5321 length limits (64-character local part, 254-character overall). Since e-mail has no visual mask, `format()` returns the same trimmed, lowercased value as `normalize()`.

### PIX keys

```ts
PIX.getKeyType("user@example.com"); // "EMAIL"
PIX.getKeyType("+5511987654321"); // "PHONE"
PIX.getKeyType("123e4567-e89b-12d3-a456-426655440000"); // "EVP"

PIX.isValid("52998224725"); // true — CPF key
PIX.isValid("529.982.247-25"); // false — Bacen's DICT key is digits-only, no punctuation

PIX.normalize("+55 (11) 98765-4321"); // "+5511987654321"
PIX.format("+5511987654321"); // "+55 (11) 98765-4321"
```

A PIX key can be a CPF, a (numeric-only) CNPJ, an e-mail, a phone number, or a random key ("EVP" — a UUID). `getKeyType` detects which; `isValid`/`normalize`/`format` dispatch to the matching rules automatically. Verified against Banco Central's DICT schema (`bacen/pix-dict-api`) and the Manual de Padrões para Iniciação do Pix — note that, per that schema, alphanumeric CNPJ is **not** currently accepted as a PIX key.

### Inscrição Estadual

```ts
IE.isValid("110.042.490.114", "SP"); // true
IE.isValid("99.999.99-3", "RJ"); // true
IE.isValid("062.307.904/0081", "MG"); // true

IE.normalize("110.042.490.114", "SP"); // "110042490114"
IE.format("110042490114", "SP"); // "110.042.490.114"
```

Inscrição Estadual has no national algorithm — each state (SEFAZ) defines its own digit count and check-digit calculation, so `IE` takes a second `uf` argument and every state is modeled as its own module, verified individually against that state's official "Roteiro de Crítica da Inscrição Estadual".

**Supported UFs (all 27):** AC, AL, AM, AP, BA, CE, DF, ES, GO, MA, MG, MS, MT, PA, PB, PE, PI, PR, RJ, RN, RO, RR, RS, SC, SE, SP, TO.

Every state's algorithm was verified against `sintegra.gov.br`'s official "Roteiro de Crítica" mirror, with one exception: DF's page there is empty, so its algorithm was instead cross-verified against two independent secondary sources that agree with each other and whose worked example was re-checked by hand — see `src/ie/states/df.ts` for details.

`IE.isValid(value, "SP")` accepts both of SP's formats automatically: the standard 12-digit format and the "Produtor Rural" format (`P-01100424.3/002`, for rural producers not equiparated to a company), the same way `CNPJ` accepts both numeric and alphanumeric values.

## Normalize behavior

`normalize()` produces the canonical (formatting-free) representation of a value:

- **CPF**, numeric **CNPJ**, **CEP**, **Phone**, and **IE** are normalized to digits only (IE keeps the state's exact digit count; Phone keeps the `+55` prefix for PIX phone keys).
- **CNPJ alphanumeric** is normalized to uppercase, keeping letters and digits (a digit-only strip would destroy alphanumeric CNPJ values).
- **Email** is normalized to a trimmed, lowercased string.
- **PIX** detects the key type first, then delegates to that type's own normalize rule (CPF/CNPJ/Email/Phone), or lowercases the value for a random key (EVP).

## Format behavior

`format()` applies the standard visual formatting for the identifier (e.g. `529.982.247-25` for CPF, `11.222.333/0001-81` for CNPJ, `(11) 91234-5678` for Phone). If the normalized value has an invalid length, `format()` returns the original input unchanged. `Email.format()` is the exception: since e-mail has no visual mask, it returns the same value as `Email.normalize()`.

## Validation behavior

`isValid()` is deterministic: it accepts raw or formatted input, but rejects any unexpected character. It never discards arbitrary characters to force an otherwise invalid value into a valid one.

## Supported languages

- **TypeScript / JavaScript (ESM)** — this package.
- **[Go](./go)** — a full port covering the same 7 validators (CPF, CNPJ, CEP, Phone, E-mail, PIX, IE for all 27 states/DF), checked against the same [`specification/`](./specification) test vectors as this implementation.
- **[Python](./python)** — same coverage as Go, also checked against [`specification/`](./specification).
- **[Java](./java)** — same coverage, also checked against [`specification/`](./specification).
- **[Ruby](./ruby)** — same coverage, also checked against [`specification/`](./specification).
- **[C#](./csharp)** — same coverage, also checked against [`specification/`](./specification).

Implementations for other languages (PHP) are a long-term goal of the broader `brazil-validator` project but are not part of this repository yet. The [`specification/`](./specification) directory holds language-independent test vectors (generated directly from this implementation) meant as the shared conformance suite for those future ports.

## Official references

- [Receita Federal — CNPJ technical documents](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj)
- [Receita Federal — CNPJ Alphanumeric Q&A (PDF)](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/cnpj/cnpj-alfanumerico.pdf)
- [Correios — Guia de Endereçamento (CEP structure)](https://www.correios.com.br/enviar/precisa-de-ajuda/guia-de-enderecamento/guia-de-enderecamento)
- [Anatel — Plano de Numeração Brasileiro](https://www.gov.br/anatel/pt-br/regulado/numeracao/plano-de-numeracao-brasileiro) (DDD list and phone number structure)
- [Anatel — Nono Dígito (Resolução nº 553/2010)](https://www.anatel.gov.br/setorregulado/nono-digito/215-numeracao/nono-digito)
- [Banco Central — DICT API schema (`bacen/pix-dict-api`)](https://github.com/bacen/pix-dict-api) and the Manual de Padrões para Iniciação do Pix
- SEFAZ "Roteiro de Crítica da Inscrição Estadual" for each supported state, mirrored at `sintegra.gov.br/Cad_Estados/`

## Contributing

Contributions are welcome. Please:

1. Add tests for any new validator or bug fix.
2. Verify Brazilian government/fiscal rules against an official source before implementing them.
3. Keep the `isValid` / `normalize` / `format` API pattern consistent with existing validators.
4. Run `npm run build && npm test` before submitting changes.

## License

MIT
