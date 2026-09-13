# brazil-validator (C#)

A validation, normalization, and formatting library for Brazilian data: CPF, CNPJ, CEP, phone numbers, e-mail, PIX keys, and Inscrição Estadual.

This is the C# port of the [TypeScript implementation](../README.md), replicating the same officially-verified rules. Every class follows the same conceptual API as static methods:

```csharp
ClassName.IsValid(string value) // -> bool
ClassName.Normalize(string value) // -> string
ClassName.Format(string value) // -> string
```

`Ie` extends this with a second `uf` argument (the check-digit algorithm is defined per state, not nationally), and `Pix` additionally exposes `GetKeyType`, returning a nullable `PixKeyType?` enum.

## Installation

Published on [NuGet](https://www.nuget.org/packages/brazil-validator):

```bash
dotnet add package brazil-validator
```

*(the NuGet PackageId is `brazil-validator`, but the C# namespace keeps its original name: `BrValidator` — a NuGet package's id and its namespace don't have to match)*

## Usage

```csharp
using BrValidator;
using BrValidator.Ie;

Cpf.IsValid("529.982.247-25");       // true
Cpf.Format("52998224725");           // "529.982.247-25"

Cnpj.IsValid("11.222.333/0001-81");  // true

Ie.IsValid("110.042.490.114", "SP"); // true

Pix.GetKeyType("+5511987654321");    // PixKeyType.Phone
```

## Classes

| Class | Notes |
| --- | --- |
| `Cpf` | |
| `Cnpj` | Numeric and alphanumeric |
| `Cep` | |
| `Phone` | National numbers only, no `+55` |
| `Email` | `Format` returns the same value as `Normalize` (no visual mask) |
| `Pix` / `PixKeyType` | `PixKeyType` enum: `Cpf`, `Cnpj`, `Email`, `Phone`, `Evp`. `GetKeyType` returns `PixKeyType?` (nullable) |
| `Ie.Ie` | All 27 states/DF; `IsValid`/`Normalize`/`Format` take `(value, uf)`. Each state's algorithm is an `internal` class in `BrValidator.Ie` — not part of the public API |

See the [main README](../README.md) for the full behavior reference (official sources, normalize/format rules per validator, known gaps) — it applies identically here.

## Conformance

`ConformanceTests` checks this implementation against [`specification/`](../specification), the language-independent test vectors generated from the TypeScript implementation. If it passes, this port behaves identically to TypeScript (and to the [Go](../go), [Python](../python), [Java](../java), and [Ruby](../ruby) ports) for every vector on file. It uses `System.Text.Json`, built into .NET — no extra dependency for parsing the vector files.

## Development

Targets `netstandard2.0` (for broad compatibility across .NET Framework, .NET Core, and modern .NET) with xUnit tests (net8.0). Requires the .NET 8 SDK.

```bash
cd csharp
dotnet build
dotnet test
```

## Contributing

Bug reports, official regression vectors, and fixes are welcome — see the root [`CONTRIBUTING.md`](../CONTRIBUTING.md) for guidelines (in particular: any Brazilian government/fiscal rule needs a cited official source).
