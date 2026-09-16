# brazil-validator (Elixir)

A validation, normalization, and formatting package for Brazilian data: CPF, CNPJ, CEP, phone numbers, e-mail, PIX keys, and Inscrição Estadual.

This is the Elixir port of the [TypeScript implementation](../README.md), replicating the same officially-verified rules. Every module follows the same conceptual API:

```elixir
Module.valid?(value)
Module.normalize(value)
Module.format(value)
```

`IE` extends this with a second `uf` argument (the check-digit algorithm is defined per state, not nationally), and `PIX` additionally exposes `get_key_type/1`.

## Installation

Add `brazil_validator` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:brazil_validator, "~> 0.1.0"}
  ]
end
```

## Usage

```elixir
alias BrazilValidator.{Cpf, Cnpj, Ie, Pix}

Cpf.valid?("529.982.247-25")       # true
Cpf.format("52998224725")          # "529.982.247-25"

Cnpj.valid?("11.222.333/0001-81")  # true

Ie.valid?("110.042.490.114", "SP") # true

Pix.get_key_type("+5511987654321")  # :phone
```

## Modules

| Module | Notes |
| --- | --- |
| `BrazilValidator.Cpf` | |
| `BrazilValidator.Cnpj` | Numeric and alphanumeric |
| `BrazilValidator.Cep` | |
| `BrazilValidator.Phone` | National numbers only, no `+55` |
| `BrazilValidator.Email` | `format/1` returns the same value as `normalize/1` (no visual mask) |
| `BrazilValidator.Pix` | Key types: `:cpf`, `:cnpj`, `:email`, `:phone`, `:evp` |
| `BrazilValidator.Ie` | All 27 states/DF; `valid?/2`, `normalize/2`, `format/2` take `(value, uf)` |

See the [main README](../README.md) for the full behavior reference.

## Conformance

`test/conformance_test.exs` tests this implementation against [`specification/`](../specification), the language-independent test vectors generated from the TypeScript implementation.

## Development

```bash
mix deps.get
mix format --check-formatted
mix test
```

## Contributing

Bug reports, official regression vectors, and fixes are welcome — see the root [`CONTRIBUTING.md`](../CONTRIBUTING.md) for guidelines.