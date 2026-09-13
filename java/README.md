# brazil-validator (Java)

A validation, normalization, and formatting library for Brazilian data: CPF, CNPJ, CEP, phone numbers, e-mail, PIX keys, and Inscrição Estadual.

This is the Java port of the [TypeScript implementation](../README.md), replicating the same officially-verified rules. Every class follows the same conceptual API as static methods:

```java
ClassName.isValid(String value) -> boolean
ClassName.normalize(String value) -> String
ClassName.format(String value) -> String
```

`Ie` extends this with a second `uf` argument (the check-digit algorithm is defined per state, not nationally), and `Pix` additionally exposes `getKeyType`, returning a `PixKeyType` enum (or `null` if unrecognized).

## Installation

Not yet published to Maven Central. Build and install into your local repository:

```bash
git clone https://github.com/matheuslm7/brazil-validator.git
cd brazil-validator/java
mvn install
```

Then add it as a dependency:

```xml
<dependency>
  <groupId>io.github.matheuslm7</groupId>
  <artifactId>brazil-validator</artifactId>
  <version>0.1.0</version>
</dependency>
```

*(the Maven artifactId is `brazil-validator`, but the Java package keeps its original name: `io.github.matheuslm7.brvalidator` — a library's artifactId and its package name don't have to match, e.g. Guava's artifactId is `guava` but its package is `com.google.common`)*

## Usage

```java
import io.github.matheuslm7.brvalidator.Cpf;
import io.github.matheuslm7.brvalidator.Cnpj;
import io.github.matheuslm7.brvalidator.ie.Ie;
import io.github.matheuslm7.brvalidator.Pix;

Cpf.isValid("529.982.247-25");        // true
Cpf.format("52998224725");            // "529.982.247-25"

Cnpj.isValid("11.222.333/0001-81");   // true

Ie.isValid("110.042.490.114", "SP");  // true

Pix.getKeyType("+5511987654321");     // PixKeyType.PHONE
```

## Classes

| Class | Notes |
| --- | --- |
| `Cpf` | |
| `Cnpj` | Numeric and alphanumeric |
| `Cep` | |
| `Phone` | National numbers only, no `+55` |
| `Email` | `format` returns the same value as `normalize` (no visual mask) |
| `Pix` / `PixKeyType` | `PixKeyType` enum: `CPF`, `CNPJ`, `EMAIL`, `PHONE`, `EVP` |
| `ie.Ie` | All 27 states/DF; `isValid`/`normalize`/`format` take `(value, uf)`. Each state's algorithm is a package-private class in `io.github.matheuslm7.brvalidator.ie` — not part of the public API |

See the [main README](../README.md) for the full behavior reference (official sources, normalize/format rules per validator, known gaps) — it applies identically here.

## Conformance

`ConformanceTest` checks this implementation against [`specification/`](../specification), the language-independent test vectors generated from the TypeScript implementation. If it passes, this port behaves identically to TypeScript (and to the [Go](../go), [Python](../python), [Ruby](../ruby), and [C#](../csharp) ports) for every vector on file. It's the only place this library pulls in a dependency (`org.json`, test-scope only, to parse the vector files) — the library itself has zero runtime dependencies.

## Development

Requires JDK 11+ and Maven.

```bash
cd java
mvn compile
mvn test
```
