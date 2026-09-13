<!-- Versão em português: .github/PULL_REQUEST_TEMPLATE.pt-BR.md -->

## What changed

<!-- Describe the change. If it's a bug fix, describe the wrong behavior it fixes. -->

## Why

<!-- What prompted this change? -->

## Official source (required for any Brazilian government/fiscal rule)

<!-- Link or reference: Receita Federal, Banco Central, Anatel, Correios, or the relevant SEFAZ documentation. -->
<!-- If this PR doesn't touch validation logic (docs, CI, refactor with no behavior change), write "N/A". -->

## Checklist

- [ ] Tests added or updated (a bug fix includes a regression test)
- [ ] The `isValid` / `normalize` / `format` pattern stays consistent with existing validators
- [ ] Ran the test command for every language touched (see [`CONTRIBUTING.md`](../CONTRIBUTING.md#testing))
- [ ] If TypeScript behavior changed, regenerated the affected `specification/*/vectors.json` file and re-ran every other language's conformance test
