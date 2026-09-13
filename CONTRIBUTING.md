# Contributing to brazil-validator

*Leia em [português (pt-BR)](./CONTRIBUTING.pt-BR.md).*

Thanks for considering a contribution — this project only gets better with more eyes on Brazilian rules that are easy to get subtly wrong. This guide covers everything you need to open a good pull request.

## Ways to contribute

- **Report a bug** — especially a wrong validation result for a real, valid Brazilian document/key. Open an issue with the input value (feel free to redact real personal documents, a synthetic example that reproduces the bug is fine) and what you expected.
- **Fix a bug** — a fix without a regression test won't be merged; see [Testing](#testing) below.
- **Add or improve official regression vectors** — more real-world verified examples make every language port stronger, since they all share [`specification/`](./specification).
- **Port an existing validator to a new language** — open an issue first proposing the language, so we can agree on idioms before you invest time.
- **Improve documentation** — READMEs, code comments explaining *why* a rule works the way it does, translations.

## The one rule that matters most: never guess Brazilian rules

This is a Brazilian government/fiscal data library. For any CPF, CNPJ, CEP, phone, PIX, or Inscrição Estadual rule:

- **Do not guess.** Do not copy an algorithm from another library or a blog post without checking it against an official source.
- **Cite your source** in the PR description: Receita Federal, Banco Central, Anatel, Correios, or the relevant state's SEFAZ "Roteiro de Crítica da Inscrição Estadual" (mirrored at `sintegra.gov.br/Cad_Estados/`).
- If no primary source exists (this happened once, for DF's Inscrição Estadual), cross-verify against at least two independent secondary sources that agree with each other, and say so explicitly in the PR and in a code comment.

A PR that changes validation logic without a cited official source will be asked to add one before merge.

## API consistency

Every validator follows the same shape, in every language:

```
Validator.isValid(value)
Validator.normalize(value)
Validator.format(value)
```

(adapted to each language's naming convention — `is_valid`/`isValid?`, `snake_case`/`PascalCase`, etc. — see each language's own README for its exact idioms).

- `isValid` accepts raw or formatted input, but rejects unexpected characters. It never silently strips arbitrary garbage to force an invalid value into a valid one.
- `normalize` strips formatting into a canonical representation.
- `format` applies the standard visual mask, or returns the input unchanged if its length is invalid.

Keep new validators consistent with this pattern unless you have a strong, documented reason not to (e.g. `IE` needs an extra `uf` argument because the algorithm is defined per state).

## Testing

Every new validator and every bug fix needs a test. If you're fixing a bug, add a regression test that fails before your fix and passes after it.

Run the full suite for whichever language(s) you touched before opening a PR:

| Language | Command (run from the language's directory, except TypeScript) |
| --- | --- |
| TypeScript | `npm run build && npm test` |
| Go | `go build ./... && go vet ./... && gofmt -l . && go test ./...` |
| Python | `PYTHONPATH=src python3 -m unittest discover -s tests -v` |
| Java | `mvn test` |
| Ruby | `bundle exec rake test` |
| C# | `dotnet test` |

Every language also has a **conformance test** that checks its behavior against [`specification/`](./specification) — the same language-independent test vectors shared by all ports. If you change behavior in the TypeScript reference implementation, run `npm run generate-vectors` to regenerate the affected `specification/*/vectors.json` file from the built package (never hand-type expected outputs) and make sure every other language's conformance test still passes.

## Code style

- Small, descriptive functions over clever one-liners.
- Comments explain *why*, not *what* — skip comments that just restate the code.
- Keep runtime dependencies at zero (or as close to it as possible). Test-only dependencies are fine when justified (e.g. a JSON parser for reading `specification/` in languages without one in the standard library).
- Don't expand the public API's input types (no numbers, `null`, objects) without discussing it first — Brazilian identifiers need to stay strings (leading zeros, alphanumeric CNPJ, etc.).

## Commit messages and branches

Commit messages in English, following this format:

```
feature: add xyz validator
fix: reject malformed xyz input
test: add regression case for xyz
docs: update xyz documentation
refactor: simplify xyz check digit calculation
chore: update dependencies
```

Branch names: `feature/<kebab-case>`, `fix/<kebab-case>`.

## Opening a pull request

1. Fork the repo and create a branch off `master`.
2. Make your change, with tests, following the conventions above.
3. Run the test command(s) for every language you touched (see the table above).
4. Open a PR describing what changed and why, citing an official source for any Brazilian rule involved.
5. Be responsive to review — this is a small project maintained in spare time, so a little patience helps too.

## Code of conduct

Be respectful and constructive. Disagreements about implementation are fine and expected; personal attacks are not.

## License

By contributing, you agree your contribution is licensed under this project's [MIT license](./LICENSE).
