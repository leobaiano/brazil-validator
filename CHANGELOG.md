# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/). Each language port (TypeScript, Go, Python, Java, Ruby, C#) is versioned and released together, so a single entry here covers all of them unless noted otherwise.

## [Unreleased]

## [0.1.0] - 2026-09-13

Initial public release, published across all six language ports and their respective package registries:

- **npm**: [`brazil-validator@0.1.0`](https://www.npmjs.com/package/brazil-validator) (TypeScript/JavaScript)
- **PyPI**: [`brazil-validator 0.1.0`](https://pypi.org/project/brazil-validator/0.1.0/) (Python)
- **RubyGems**: [`brazil-validator 0.1.0`](https://rubygems.org/gems/brazil-validator) (Ruby)
- **NuGet**: [`brazil-validator 0.1.0`](https://www.nuget.org/packages/brazil-validator) (C#)
- **Go**: [`github.com/matheuslm7/brazil-validator/go@v0.1.0`](https://pkg.go.dev/github.com/matheuslm7/brazil-validator/go) (resolved directly via Git, no separate registry)
- **Maven Central**: [`io.github.matheuslm7:brazil-validator:0.1.0`](https://central.sonatype.com/artifact/io.github.matheuslm7/brazil-validator) (Java)

### Added

- **CPF** — `isValid`, `normalize`, `format`.
- **CNPJ** — numeric and alphanumeric (Receita Federal's newer format), `isValid`, `normalize`, `format`.
- **CEP** — `isValid`, `normalize`, `format`.
- **Phone numbers** — national numbers only (no `+55`), Anatel-verified DDD list and "ninth digit" rule.
- **E-mail** — WHATWG-compliant validation, RFC 5321 length limits.
- **PIX keys** — `getKeyType` (CPF, CNPJ, e-mail, phone, EVP/random key) plus `isValid`/`normalize`/`format`, verified against Banco Central's DICT schema.
- **Inscrição Estadual (IE)** — all 27 states/DF, each with its own independently-verified check-digit algorithm, plus SP's "Produtor Rural" format.
- **`specification/`** — language-independent JSON test vectors, generated from the TypeScript reference implementation, used as the shared conformance suite across all six ports.
- `CONTRIBUTING.md` / `CONTRIBUTING.pt-BR.md`, GitHub Actions CI (one job per language), and issue/PR templates.

[Unreleased]: https://github.com/matheuslm7/brazil-validator/compare/go/v0.1.0...HEAD
[0.1.0]: https://github.com/matheuslm7/brazil-validator/releases/tag/go/v0.1.0
