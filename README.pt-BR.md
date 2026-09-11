# br-validator

Uma biblioteca de validação, normalização e formatação de dados brasileiros (CPF, CNPJ e mais).

*Read this in [English](./README.md).*

`br-validator` é um projeto open-source independente. **Não** é uma biblioteca oficial da Receita Federal, nem possui qualquer afiliação com órgãos do governo brasileiro.

## Instalação

```bash
npm install br-validator
```

## Uso

```ts
import { CPF, CNPJ } from "br-validator";

CPF.isValid("529.982.247-25"); // true
CPF.normalize("529.982.247-25"); // "52998224725"
CPF.format("52998224725"); // "529.982.247-25"

CNPJ.isValid("11.222.333/0001-81"); // true
CNPJ.normalize("11.222.333/0001-81"); // "11222333000181"
CNPJ.format("11222333000181"); // "11.222.333/0001-81"
```

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

## Validadores suportados

| Validador | Status |
| --- | --- |
| CPF | ✅ Disponível |
| CNPJ (numérico) | ✅ Disponível |
| CNPJ (alfanumérico) | ✅ Disponível |
| CEP | ✅ Disponível |
| Telefone | Planejado |
| E-mail | Planejado |
| Chave PIX | Planejado |
| Inscrição Estadual | Planejado |

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

## Comportamento do normalize

`normalize()` produz a representação canônica (sem formatação) de um valor:

- **CPF** e **CNPJ numérico** são normalizados para apenas dígitos.
- **CNPJ alfanumérico** é normalizado para maiúsculas, mantendo letras e dígitos (remover apenas os não-dígitos destruiria valores alfanuméricos de CNPJ).
- **CEP** é normalizado para apenas dígitos.

## Comportamento do format

`format()` aplica a formatação visual padrão do identificador (ex.: `529.982.247-25` para CPF, `11.222.333/0001-81` para CNPJ). Se o valor normalizado tiver comprimento inválido, `format()` retorna a entrada original sem alterações.

## Comportamento de validação

`isValid()` é determinístico: aceita entrada crua ou formatada, mas rejeita qualquer caractere inesperado. Nunca descarta caracteres arbitrários para forçar um valor inválido a se tornar válido.

## Linguagens suportadas

Atualmente disponível como pacote TypeScript / JavaScript (ESM). Implementações em outras linguagens são um objetivo de longo prazo do projeto `br-validator` como um todo, mas ainda não fazem parte deste pacote.

## Referências oficiais

- [Receita Federal — Documentos técnicos do CNPJ](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj)
- [Receita Federal — Perguntas e respostas sobre CNPJ Alfanumérico (PDF)](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/cnpj/cnpj-alfanumerico.pdf)
- [Correios — Guia de Endereçamento (estrutura do CEP)](https://www.correios.com.br/enviar/precisa-de-ajuda/guia-de-enderecamento/guia-de-enderecamento)

## Contribuindo

Contribuições são bem-vindas. Por favor:

1. Adicione testes para qualquer novo validador ou correção de bug.
2. Verifique regras fiscais/governamentais brasileiras em uma fonte oficial antes de implementá-las.
3. Mantenha o padrão de API `isValid` / `normalize` / `format` consistente com os validadores existentes.
4. Rode `npm run build && npm test` antes de enviar alterações.

## Licença

MIT
