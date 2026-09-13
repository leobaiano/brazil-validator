# brazil-validator (Ruby)

A validation, normalization, and formatting gem for Brazilian data: CPF, CNPJ, CEP, phone numbers, e-mail, PIX keys, and Inscrição Estadual.

This is the Ruby port of the [TypeScript implementation](../README.md), replicating the same officially-verified rules. Every module follows the same conceptual API:

```ruby
Module.is_valid?(value) # -> true/false
Module.normalize(value) # -> String
Module.format(value)    # -> String
```

Two adaptations to Ruby convention: `is_valid?` carries the idiomatic `?` suffix for a predicate method (kept the `is_` prefix so the name still matches every other language's `isValid`/`is_valid`), and PIX's key-type lookup is named `key_type` (not `get_key_type`, per Ruby's convention of dropping `get_` on simple readers) and returns a symbol (`:cpf`, `:cnpj`, `:email`, `:phone`, `:evp`) or `nil` — not a string enum.

`Ie` extends the pattern with a second `uf` argument (the check-digit algorithm is defined per state, not nationally).

## Installation

Published on [RubyGems](https://rubygems.org/gems/brazil-validator):

```bash
gem install brazil-validator
```

Or add to your `Gemfile`:

```ruby
gem "brazil-validator", "~> 0.1"
```

*(the gem is published as `brazil-validator`, but the require path keeps its original name: `require "br_validator"` — a gem's published name and its require path don't have to match, e.g. the `activesupport` gem is required as `active_support`)*

## Usage

```ruby
require "br_validator"

BrValidator::Cpf.is_valid?("529.982.247-25")       # true
BrValidator::Cpf.format("52998224725")             # "529.982.247-25"

BrValidator::Cnpj.is_valid?("11.222.333/0001-81")  # true

BrValidator::Ie.is_valid?("110.042.490.114", "SP") # true

BrValidator::Pix.key_type("+5511987654321")        # :phone
```

## Modules

| Module | Notes |
| --- | --- |
| `Cpf` | |
| `Cnpj` | Numeric and alphanumeric |
| `Cep` | |
| `Phone` | National numbers only, no `+55` |
| `Email` | `format` returns the same value as `normalize` (no visual mask) |
| `Pix` | `key_type` returns a symbol: `:cpf`, `:cnpj`, `:email`, `:phone`, `:evp`, or `nil` |
| `Ie` | All 27 states/DF; `is_valid?`/`normalize`/`format` take `(value, uf)`. Each state is its own module under `BrValidator::Ie` — not part of the public API, only `BrValidator::Ie` itself is meant to be used directly |

See the [main README](../README.md) for the full behavior reference (official sources, normalize/format rules per validator, known gaps) — it applies identically here.

## Conformance

`test/conformance_test.rb` checks this implementation against [`specification/`](../specification), the language-independent test vectors generated from the TypeScript implementation. If it passes, this port behaves identically to TypeScript (and to the [Go](../go), [Python](../python), [Java](../java), and [C#](../csharp) ports) for every vector on file.

## Development

Zero runtime dependencies. Tests use Minitest (bundled with Ruby) — `rake` and `minitest` are declared as development dependencies only.

```bash
cd ruby
bundle install
bundle exec rake test
```

## Contributing

Bug reports, official regression vectors, and fixes are welcome — see the root [`CONTRIBUTING.md`](../CONTRIBUTING.md) for guidelines (in particular: any Brazilian government/fiscal rule needs a cited official source).
