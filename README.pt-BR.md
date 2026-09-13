# brazil-validator

Uma biblioteca de validação, normalização e formatação de dados brasileiros: CPF, CNPJ, CEP, telefone, e-mail, chaves PIX e Inscrição Estadual.

*Read this in [English](./README.md).*

`brazil-validator` é um projeto open-source independente. **Não** é uma biblioteca oficial da Receita Federal, nem possui qualquer afiliação com órgãos do governo brasileiro.

## Instalação e uso

Este repositório disponibiliza os mesmos validadores em mais de uma linguagem. Escolha a sua:

### TypeScript / JavaScript

```bash
npm install brazil-validator
```

```ts
import { CPF, CNPJ, CEP, Phone, Email, PIX, IE } from "brazil-validator";

CPF.isValid("529.982.247-25"); // true
CPF.normalize("529.982.247-25"); // "52998224725"
CPF.format("52998224725"); // "529.982.247-25"

CNPJ.isValid("11.222.333/0001-81"); // true
CNPJ.normalize("11.222.333/0001-81"); // "11222333000181"
CNPJ.format("11222333000181"); // "11.222.333/0001-81"

Phone.isValid("(11) 91234-5678"); // true
Email.isValid("user@example.com"); // true
PIX.isValid("+5511987654321"); // true
IE.isValid("110.042.490.114", "SP"); // true
```

O restante deste README documenta em detalhes a API em TypeScript/JavaScript (é a implementação de referência — as demais linguagens se comportam de forma idêntica, conferidas contra os mesmos vetores de teste de [`specification/`](./specification)).

### Go

Ainda não publicado como release com tag, mas instalável direto deste repositório (módulos Go funcionam sobre git puro, sem precisar de registro):

```bash
go get github.com/matheuslm7/brazil-validator/go
```

```go
import (
	"github.com/matheuslm7/brazil-validator/go/cpf"
	"github.com/matheuslm7/brazil-validator/go/ie"
)

cpf.IsValid("529.982.247-25")       // true
ie.IsValid("110.042.490.114", "SP") // true
```

Referência completa do Go: [`go/README.md`](./go).

### Python

Ainda não publicado no PyPI. Instale direto do subdiretório `python/` deste repositório:

```bash
pip install "brazil-validator @ git+https://github.com/matheuslm7/brazil-validator.git#subdirectory=python"
```

```python
from br_validator import cpf, ie

cpf.is_valid("529.982.247-25")        # True
ie.is_valid("110.042.490.114", "SP")  # True
```

Referência completa do Python: [`python/README.md`](./python).

### Java

Ainda não publicado no Maven Central. Compile e instale no seu repositório Maven local:

```bash
git clone https://github.com/matheuslm7/brazil-validator.git
cd brazil-validator/java
mvn install
```

```java
import io.github.matheuslm7.brvalidator.Cpf;
import io.github.matheuslm7.brvalidator.ie.Ie;

Cpf.isValid("529.982.247-25");       // true
Ie.isValid("110.042.490.114", "SP"); // true
```

Referência completa do Java: [`java/README.md`](./java).

### Ruby

Ainda não publicado no RubyGems. Adicione direto deste repositório no seu `Gemfile`:

```ruby
gem "brazil-validator", git: "https://github.com/matheuslm7/brazil-validator.git", glob: "ruby/*.gemspec"
```

```ruby
require "br_validator"

BrValidator::Cpf.is_valid?("529.982.247-25")       # true
BrValidator::Ie.is_valid?("110.042.490.114", "SP") # true
```

Referência completa do Ruby: [`ruby/README.md`](./ruby).

### C#

Ainda não publicado no NuGet. Clone e referencie o projeto direto:

```bash
git clone https://github.com/matheuslm7/brazil-validator.git
dotnet add SeuProjeto.csproj reference brazil-validator/csharp/src/BrValidator/BrValidator.csproj
```

```csharp
using BrValidator;
using BrValidator.Ie;

Cpf.IsValid("529.982.247-25");       // true
Ie.IsValid("110.042.490.114", "SP"); // true
```

Referência completa do C#: [`csharp/README.md`](./csharp).

## API

Todo validador da biblioteca segue o mesmo padrão conceitual:

```ts
Validator.isValid(value: string): boolean
Validator.normalize(value: string): string
Validator.format(value: string): string
```

- **`isValid(value)`** — retorna `true` se `value` for um identificador válido. Aceita entrada crua ou formatada, mas rejeita caracteres inesperados (uma entrada inválida nunca é silenciosamente "higienizada" até virar válida).
- **`normalize(value)`** — remove a formatação e retorna a representação canônica de `value`.
- **`format(value)`** — retorna `value` na sua representação visual padrão. Se `value` tiver um comprimento inválido, é retornado sem alterações.

Dois validadores estendem esse padrão por motivos específicos ao que validam:

- **`IE`** (Inscrição Estadual) recebe um segundo argumento `uf` — `IE.isValid(value, uf)` — porque o algoritmo do dígito verificador é definido por estado, não nacionalmente.
- **`PIX`** também expõe `PIX.getKeyType(value)`, já que uma chave PIX pode ser CPF, CNPJ, e-mail, telefone ou chave aleatória, e quem consome a API geralmente precisa saber qual tipo é.

## Validadores suportados

| Validador | Status |
| --- | --- |
| CPF | ✅ Disponível |
| CNPJ (numérico) | ✅ Disponível |
| CNPJ (alfanumérico) | ✅ Disponível |
| CEP | ✅ Disponível |
| Telefone | ✅ Disponível |
| E-mail | ✅ Disponível |
| Chave PIX | ✅ Disponível |
| Inscrição Estadual | ✅ Disponível para os 27 estados/DF |

### CPF

```ts
CPF.isValid("529.982.247-25"); // true
CPF.isValid("52998224725"); // true
CPF.isValid("111.111.111-11"); // false (dígitos repetidos)

CPF.normalize("529.982.247-25"); // "52998224725"
CPF.format("52998224725"); // "529.982.247-25"
```

### CNPJ

A validação de CNPJ cobre tanto o formato numérico tradicional quanto o formato alfanumérico introduzido pela Receita Federal.

```ts
// Numérico
CNPJ.isValid("11.222.333/0001-81"); // true
CNPJ.normalize("11.222.333/0001-81"); // "11222333000181"
CNPJ.format("11222333000181"); // "11.222.333/0001-81"

// Alfanumérico
CNPJ.isValid("12.ABC.345/01DE-35"); // true
CNPJ.normalize("12.ABC.345/01DE-35"); // "12ABC34501DE35"
CNPJ.format("12ABC34501DE35"); // "12.ABC.345/01DE-35"
```

O CNPJ alfanumérico usa 12 posições alfanuméricas (`A-Z`, `0-9`) seguidas de 2 dígitos verificadores numéricos, calculados com módulo 11 conforme a documentação técnica oficial da Receita Federal.

### CEP

```ts
CEP.isValid("01310-100"); // true
CEP.isValid("01310100"); // true
CEP.isValid("0131010"); // false (comprimento incorreto)

CEP.normalize("01310-100"); // "01310100"
CEP.format("01310100"); // "01310-100"
```

O CEP (Código de Endereçamento Postal) é um código de roteamento postal de 8 dígitos definido pelos Correios. Diferente de CPF/CNPJ, não possui dígito verificador — a validação aqui checa apenas a estrutura (8 dígitos), não se o código existe na base de endereços dos Correios.

### Telefone

```ts
Phone.isValid("(11) 91234-5678"); // true — celular, com formatação
Phone.isValid("11912345678"); // true — celular, sem formatação
Phone.isValid("(11) 2345-6789"); // true — fixo
Phone.isValid("11812345678"); // false — celular sem o nono dígito "9"

Phone.normalize("(11) 91234-5678"); // "11912345678"
Phone.format("11912345678"); // "(11) 91234-5678"
```

Apenas números nacionais são suportados (sem código de país `+55`). A validação segue o plano de numeração da Anatel: o DDD precisa ser um dos 67 códigos de fato atribuídos pela Anatel, números de celular (11 dígitos) precisam ter o "nono dígito" `9` (Resolução nº 553/2010), e números fixos (10 dígitos) precisam começar com 2-5.

### E-mail

```ts
Email.isValid("user@example.com"); // true
Email.isValid("user@example"); // false — sem TLD no domínio

Email.normalize("User@Example.COM"); // "user@example.com"
Email.format("User@Example.COM"); // "user@example.com"
```

A validação segue a expressão regular de e-mail do WHATWG HTML Living Standard (a mesma usada pelos navegadores em `<input type="email">`), além dos limites de tamanho da RFC 5321 (64 caracteres na parte local, 254 no total). Como e-mail não tem máscara visual, `format()` retorna o mesmo valor "trimado" e em minúsculas que `normalize()`.

### Chave PIX

```ts
PIX.getKeyType("user@example.com"); // "EMAIL"
PIX.getKeyType("+5511987654321"); // "PHONE"
PIX.getKeyType("123e4567-e89b-12d3-a456-426655440000"); // "EVP"

PIX.isValid("52998224725"); // true — chave CPF
PIX.isValid("529.982.247-25"); // false — a chave do DICT do Bacen é só dígitos, sem pontuação

PIX.normalize("+55 (11) 98765-4321"); // "+5511987654321"
PIX.format("+5511987654321"); // "+55 (11) 98765-4321"
```

Uma chave PIX pode ser CPF, CNPJ (apenas numérico), e-mail, telefone ou chave aleatória ("EVP" — um UUID). `getKeyType` detecta qual é; `isValid`/`normalize`/`format` direcionam automaticamente para a regra do tipo correspondente. Verificado contra o schema do DICT do Banco Central (`bacen/pix-dict-api`) e o Manual de Padrões para Iniciação do Pix — segundo esse schema, CNPJ alfanumérico **não** é aceito atualmente como chave PIX.

### Inscrição Estadual

```ts
IE.isValid("110.042.490.114", "SP"); // true
IE.isValid("99.999.99-3", "RJ"); // true
IE.isValid("062.307.904/0081", "MG"); // true

IE.normalize("110.042.490.114", "SP"); // "110042490114"
IE.format("110042490114", "SP"); // "110.042.490.114"
```

Inscrição Estadual não tem um algoritmo nacional — cada estado (SEFAZ) define sua própria quantidade de dígitos e cálculo de dígito verificador, então `IE` recebe um segundo argumento `uf` e cada estado é modelado como seu próprio módulo, verificado individualmente contra o "Roteiro de Crítica da Inscrição Estadual" oficial daquele estado.

**UFs suportadas (todas as 27):** AC, AL, AM, AP, BA, CE, DF, ES, GO, MA, MG, MS, MT, PA, PB, PE, PI, PR, RJ, RN, RO, RR, RS, SC, SE, SP, TO.

O algoritmo de cada estado foi verificado contra o espelho oficial do "Roteiro de Crítica" em `sintegra.gov.br`, com uma exceção: a página do DF lá está vazia, então seu algoritmo foi verificado cruzando duas fontes secundárias independentes que concordam entre si, com o exemplo numérico reconferido manualmente — veja `src/ie/states/df.ts` para os detalhes.

`IE.isValid(value, "SP")` aceita automaticamente os dois formatos de SP: o padrão de 12 dígitos e o formato "Produtor Rural" (`P-01100424.3/002`, para produtores rurais não equiparados a empresa), da mesma forma que `CNPJ` aceita tanto valores numéricos quanto alfanuméricos.

## Comportamento do normalize

`normalize()` produz a representação canônica (sem formatação) de um valor:

- **CPF**, **CNPJ numérico**, **CEP**, **Telefone** e **IE** são normalizados para apenas dígitos (IE mantém a quantidade exata de dígitos do estado; Telefone mantém o prefixo `+55` no caso de chave PIX).
- **CNPJ alfanumérico** é normalizado para maiúsculas, mantendo letras e dígitos (remover apenas os não-dígitos destruiria valores alfanuméricos de CNPJ).
- **E-mail** é normalizado para uma string "trimada" e em minúsculas.
- **PIX** primeiro detecta o tipo da chave, depois delega para a regra de normalize daquele tipo (CPF/CNPJ/Email/Telefone), ou coloca em minúsculas no caso de chave aleatória (EVP).

## Comportamento do format

`format()` aplica a formatação visual padrão do identificador (ex.: `529.982.247-25` para CPF, `11.222.333/0001-81` para CNPJ, `(11) 91234-5678` para Telefone). Se o valor normalizado tiver comprimento inválido, `format()` retorna a entrada original sem alterações. `Email.format()` é a exceção: como e-mail não tem máscara visual, retorna o mesmo valor que `Email.normalize()`.

## Comportamento de validação

`isValid()` é determinístico: aceita entrada crua ou formatada, mas rejeita qualquer caractere inesperado. Nunca descarta caracteres arbitrários para forçar um valor inválido a se tornar válido.

## Linguagens suportadas

- **TypeScript / JavaScript (ESM)** — este pacote.
- **[Go](./go)** — uma porta completa cobrindo os mesmos 7 validadores (CPF, CNPJ, CEP, Telefone, E-mail, PIX, IE nos 27 estados/DF), conferida contra os mesmos vetores de teste de [`specification/`](./specification) desta implementação.
- **[Python](./python)** — mesma cobertura do Go, também conferida contra [`specification/`](./specification).
- **[Java](./java)** — mesma cobertura, também conferida contra [`specification/`](./specification).
- **[Ruby](./ruby)** — mesma cobertura, também conferida contra [`specification/`](./specification).
- **[C#](./csharp)** — mesma cobertura, também conferida contra [`specification/`](./specification).

Implementações em outras linguagens (PHP) são um objetivo de longo prazo do projeto `brazil-validator` como um todo, mas ainda não fazem parte deste repositório. O diretório [`specification/`](./specification) guarda vetores de teste independentes de linguagem (gerados diretamente a partir desta implementação), pensados como a suíte de conformidade compartilhada para essas futuras portas.

## Referências oficiais

- [Receita Federal — Documentos técnicos do CNPJ](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj)
- [Receita Federal — Perguntas e respostas sobre CNPJ Alfanumérico (PDF)](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/cnpj/cnpj-alfanumerico.pdf)
- [Correios — Guia de Endereçamento (estrutura do CEP)](https://www.correios.com.br/enviar/precisa-de-ajuda/guia-de-enderecamento/guia-de-enderecamento)
- [Anatel — Plano de Numeração Brasileiro](https://www.gov.br/anatel/pt-br/regulado/numeracao/plano-de-numeracao-brasileiro) (lista de DDDs e estrutura do número de telefone)
- [Anatel — Nono Dígito (Resolução nº 553/2010)](https://www.anatel.gov.br/setorregulado/nono-digito/215-numeracao/nono-digito)
- [Banco Central — schema da API do DICT (`bacen/pix-dict-api`)](https://github.com/bacen/pix-dict-api) e o Manual de Padrões para Iniciação do Pix
- "Roteiro de Crítica da Inscrição Estadual" de cada SEFAZ suportada, espelhado em `sintegra.gov.br/Cad_Estados/`

## Contribuindo

Contribuições são bem-vindas. Por favor:

1. Adicione testes para qualquer novo validador ou correção de bug.
2. Verifique regras fiscais/governamentais brasileiras em uma fonte oficial antes de implementá-las.
3. Mantenha o padrão de API `isValid` / `normalize` / `format` consistente com os validadores existentes.
4. Rode `npm run build && npm test` antes de enviar alterações.

## Licença

MIT
