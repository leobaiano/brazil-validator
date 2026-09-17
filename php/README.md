# brazil-validator (PHP)

A validation, normalization, and formatting package for Brazilian data: CPF, CNPJ, CEP, phone numbers, e-mail, PIX keys, and Inscrição Estadual.

This is the PHP port of the [TypeScript implementation](../README.md), replicating the same officially-verified rules. It is a plain, framework-agnostic package — no Laravel/Symfony coupling — so it works the same way in any PHP project. Every class follows the same conceptual API:

```php
Class::isValid(string $value): bool
Class::normalize(string $value): string
Class::format(string $value): string
```

`Ie` extends this with a second `$uf` argument (the check-digit algorithm is defined per state, not nationally), and `Pix` additionally exposes `getKeyType()`, returning a `PixKeyType` enum case or `null`.

## Installation

```bash
composer require matheuslm7/brazil-validator
```

*(the Composer package name is `matheuslm7/brazil-validator`, but the PHP namespace keeps its original name: `BrValidator` — a package's name and its namespace don't have to match)*

## Usage

```php
use BrValidator\Cpf;
use BrValidator\Cnpj;
use BrValidator\Ie;
use BrValidator\Pix;

Cpf::isValid('529.982.247-25');       // true
Cpf::format('52998224725');           // "529.982.247-25"

Cnpj::isValid('11.222.333/0001-81');  // true
Cnpj::isValid('12.ABC.345/01DE-35');  // true (alphanumeric CNPJ)

Ie::isValid('110.042.490.114', 'SP'); // true

Pix::getKeyType('+5511987654321');    // PixKeyType::Phone
```

## Classes

| Class | Notes |
| --- | --- |
| `BrValidator\Cpf` | |
| `BrValidator\Cnpj` | Numeric and alphanumeric |
| `BrValidator\Cep` | |
| `BrValidator\Phone` | National numbers only, no `+55` |
| `BrValidator\Email` | `format()` returns the same value as `normalize()` (no visual mask) |
| `BrValidator\Pix` | `PixKeyType` enum cases: `Cpf`, `Cnpj`, `Email`, `Phone`, `Evp` |
| `BrValidator\Ie` | All 27 states/DF; `isValid()`, `normalize()`, `format()` take `(string $value, string $uf)` |

Each Inscrição Estadual state lives in its own class under `BrValidator\Ie\` (`Ac`, `Al`, ... `To`) — these are implementation details, not part of the public API. Use `BrValidator\Ie` directly.

See the [main README](../README.md) for the full behavior reference.

## Conformance

`tests/ConformanceTest.php` tests this implementation against [`specification/`](../specification), the language-independent test vectors shared by every port (TypeScript, Go, Python, Java, Ruby, C#).

## Development

```bash
composer install
composer test        # runs PHPUnit
```

## Contributing

Bug reports, official regression vectors, and fixes are welcome — see the root [`CONTRIBUTING.md`](../CONTRIBUTING.md) for guidelines.
