# brazil-validator (Python)

A validation, normalization, and formatting package for Brazilian data: CPF, CNPJ, CEP, phone numbers, e-mail, PIX keys, and Inscrição Estadual.

This is the Python port of the [TypeScript implementation](../README.md), replicating the same officially-verified rules. Every module follows the same conceptual API:

```python
module.is_valid(value: str) -> bool
module.normalize(value: str) -> str
module.format(value: str) -> str
```

`ie` extends this with a second `uf` argument (the check-digit algorithm is defined per state, not nationally), and `pix` additionally exposes `get_key_type`.

## Installation

Published on [PyPI](https://pypi.org/project/brazil-validator/):

```bash
pip install brazil-validator
```

*(the PyPI distribution name is `brazil-validator`, but — like `beautifulsoup4`/`bs4` or `python-dateutil`/`dateutil` — the importable package keeps its original name, `br_validator`)*

## Usage

```python
from br_validator import cpf, cnpj, ie, pix

cpf.is_valid("529.982.247-25")       # True
cpf.format("52998224725")            # "529.982.247-25"

cnpj.is_valid("11.222.333/0001-81")  # True

ie.is_valid("110.042.490.114", "SP") # True

pix.get_key_type("+5511987654321")   # pix.KeyType.PHONE
```

## Modules

| Module | Notes |
| --- | --- |
| `cpf` | |
| `cnpj` | Numeric and alphanumeric |
| `cep` | |
| `phone` | National numbers only, no `+55` |
| `email` | `format` returns the same value as `normalize` (no visual mask) |
| `pix` | `KeyType` enum: `CPF`, `CNPJ`, `EMAIL`, `PHONE`, `EVP` |
| `ie` | All 27 states/DF; `is_valid`/`normalize`/`format` take `(value, uf)` |

See the [main README](../README.md) for the full behavior reference (official sources, normalize/format rules per validator, known gaps) — it applies identically here.

## Conformance

`tests/test_conformance.py` checks this implementation against [`specification/`](../specification), the language-independent test vectors generated from the TypeScript implementation. If those tests pass, this port behaves identically to TypeScript (and to the [Go](../go), [Java](../java), [Ruby](../ruby), and [C#](../csharp) ports) for every vector on file.

## Development

This package has zero runtime dependencies and tests are written with the standard library's `unittest` (no pytest needed).

```bash
cd python
PYTHONPATH=src python3 -m unittest discover -s tests -v
python3 -m compileall src tests
```

## Contributing

Bug reports, official regression vectors, and fixes are welcome — see the root [`CONTRIBUTING.md`](../CONTRIBUTING.md) for guidelines (in particular: any Brazilian government/fiscal rule needs a cited official source).
