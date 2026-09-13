# brazil-validator specification

Language-independent test vectors for the validators implemented by `brazil-validator`. This is the foundation described in the project's long-term multi-language goal: every language implementation (TypeScript, Go, Python, Java, Ruby, C#, and PHP once it exists) is expected to produce the same `valid` / `normalized` / `formatted` results for the same `input`, so this directory is the shared source of truth to test each of them against.

These vectors were generated directly from the current TypeScript implementation (`src/`), not hand-typed, so they reflect its actual behavior exactly. They are a representative sample for each validator — covering a valid formatted input, a valid unformatted input, and a few invalid cases (wrong check digit, wrong length, unexpected characters) — not an exhaustive dump of every test case in `tests/`.

## Layout

```
specification/
├── cpf/vectors.json
├── cnpj/vectors.json
├── cep/vectors.json
├── phone/vectors.json
├── email/vectors.json
├── pix/vectors.json
└── ie/vectors.json
```

## Schema

Every vector is a JSON object with at least these fields:

```json
{
  "input": "529.982.247-25",
  "valid": true,
  "normalized": "52998224725",
  "formatted": "529.982.247-25"
}
```

- **`input`** — the raw string passed to `isValid` / `normalize` / `format`.
- **`valid`** — the expected result of `isValid(input)`.
- **`normalized`** — the expected result of `normalize(input)`. This is defined even when `valid` is `false`: `normalize()` only strips formatting, it does not validate.
- **`formatted`** — the expected result of `format(input)`. When the normalized value has an invalid length, this equals `input` unchanged (see the main README's "Format behavior" section).

Two validators extend this schema, matching the extra arguments/fields their TypeScript API has:

- **`pix/vectors.json`** adds **`keyType`**: the expected result of `PIX.getKeyType(input)` (`"CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP" | null`).
- **`ie/vectors.json`** adds **`uf`**: the two-letter state code passed as the second argument to `IE.isValid(input, uf)` / `IE.normalize(input, uf)` / `IE.format(input, uf)`.

## Regenerating

There is no regeneration script yet — vectors were produced by a one-off script that imports the built package (`dist/`) and calls each validator directly, so they can never drift from hand-typed expectations. If you add a validator or change behavior, regenerate its file the same way: call the real implementation, don't hand-write expected outputs.

## Contributing

Adding a well-sourced regression vector here (with an official reference) strengthens every language port at once. See the root [`CONTRIBUTING.md`](../CONTRIBUTING.md) for guidelines.
