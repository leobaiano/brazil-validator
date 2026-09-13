# Contribuindo com o brazil-validator

*Read this in [English](./CONTRIBUTING.md).*

Obrigado por considerar contribuir — esse projeto só melhora com mais gente de olho em regras brasileiras que são fáceis de errar sutilmente. Este guia cobre tudo que você precisa para abrir uma boa pull request.

## Formas de contribuir

- **Reportar um bug** — especialmente um resultado de validação errado para um documento/chave brasileira real e válida. Abra uma issue com o valor de entrada (pode usar um exemplo sintético que reproduza o bug, sem precisar expor documentos reais) e o resultado esperado.
- **Corrigir um bug** — uma correção sem teste de regressão não será aceita; veja [Testes](#testes) abaixo.
- **Adicionar ou melhorar vetores de regressão oficiais** — mais exemplos reais e verificados fortalecem todas as linguagens de uma vez, já que todas compartilham [`specification/`](./specification).
- **Portar um validador existente para uma nova linguagem** — abra uma issue primeiro propondo a linguagem, para alinharmos as convenções antes de você investir tempo.
- **Melhorar a documentação** — READMEs, comentários no código explicando *por que* uma regra funciona daquele jeito, traduções.

## A regra mais importante: nunca chute regras brasileiras

Esta é uma biblioteca de dados fiscais/governamentais brasileiros. Para qualquer regra de CPF, CNPJ, CEP, telefone, PIX ou Inscrição Estadual:

- **Não chute.** Não copie um algoritmo de outra biblioteca ou de um post de blog sem checar contra uma fonte oficial.
- **Cite sua fonte** na descrição da PR: Receita Federal, Banco Central, Anatel, Correios, ou o "Roteiro de Crítica da Inscrição Estadual" da SEFAZ do estado correspondente (espelhado em `sintegra.gov.br/Cad_Estados/`).
- Se não existir fonte primária (isso aconteceu uma vez, para a Inscrição Estadual do DF), verifique cruzando pelo menos duas fontes secundárias independentes que concordem entre si, e diga isso explicitamente na PR e em um comentário no código.

Uma PR que muda lógica de validação sem citar uma fonte oficial vai receber um pedido para adicionar uma antes do merge.

## Consistência de API

Todo validador segue o mesmo formato, em toda linguagem:

```
Validator.isValid(value)
Validator.normalize(value)
Validator.format(value)
```

(adaptado à convenção de nomenclatura de cada linguagem — `is_valid`/`isValid?`, `snake_case`/`PascalCase`, etc. — veja o README de cada linguagem para seus idiomas exatos).

- `isValid` aceita entrada crua ou formatada, mas rejeita caracteres inesperados. Nunca descarta caracteres arbitrários para forçar um valor inválido a se tornar válido.
- `normalize` remove a formatação e retorna a representação canônica.
- `format` aplica a máscara visual padrão, ou retorna a entrada inalterada se o tamanho for inválido.

Mantenha novos validadores consistentes com esse padrão, a menos que você tenha uma razão forte e documentada para não seguir (por exemplo, `IE` precisa de um argumento extra `uf` porque o algoritmo é definido por estado).

## Testes

Todo novo validador e toda correção de bug precisa de um teste. Se você está corrigindo um bug, adicione um teste de regressão que falha antes da sua correção e passa depois dela.

Rode a suíte completa da(s) linguagem(ns) que você alterou antes de abrir uma PR:

| Linguagem | Comando (executar no diretório da linguagem, exceto TypeScript) |
| --- | --- |
| TypeScript | `npm run build && npm test` |
| Go | `go build ./... && go vet ./... && gofmt -l . && go test ./...` |
| Python | `PYTHONPATH=src python3 -m unittest discover -s tests -v` |
| Java | `mvn test` |
| Ruby | `bundle exec rake test` |
| C# | `dotnet test` |

Toda linguagem também tem um **teste de conformidade** que checa seu comportamento contra [`specification/`](./specification) — os mesmos vetores de teste independentes de linguagem compartilhados por todas as implementações. Se você mudar o comportamento da implementação de referência em TypeScript, regenere o arquivo `specification/*/vectors.json` afetado a partir do pacote já compilado (nunca digite os resultados esperados manualmente) e garanta que o teste de conformidade de toda outra linguagem continue passando.

## Estilo de código

- Funções pequenas e descritivas em vez de one-liners espertos.
- Comentários explicam *por que*, não *o que* — evite comentários que só repetem o código.
- Mantenha as dependências de runtime em zero (ou o mais perto disso possível). Dependências apenas de teste são aceitáveis quando justificadas (ex: um parser de JSON para ler `specification/` em linguagens sem um na biblioteca padrão).
- Não expanda os tipos de entrada da API pública (sem números, `null`, objetos) sem discutir antes — identificadores brasileiros precisam continuar sendo strings (zeros à esquerda, CNPJ alfanumérico, etc.).

## Mensagens de commit e branches

Mensagens de commit em inglês, seguindo este formato:

```
feature: add xyz validator
fix: reject malformed xyz input
test: add regression case for xyz
docs: update xyz documentation
refactor: simplify xyz check digit calculation
chore: update dependencies
```

Nomes de branch: `feature/<kebab-case>`, `fix/<kebab-case>`.

## Abrindo uma pull request

1. Faça um fork do repositório e crie uma branch a partir de `master`.
2. Faça sua alteração, com testes, seguindo as convenções acima.
3. Rode o(s) comando(s) de teste para toda linguagem que você alterou (veja a tabela acima).
4. Abra uma PR descrevendo o que mudou e por quê, citando uma fonte oficial para qualquer regra brasileira envolvida.
5. Seja responsivo durante a revisão — este é um projeto pequeno mantido nas horas vagas, então um pouco de paciência ajuda também.

## Código de conduta

Seja respeitoso e construtivo. Discordâncias sobre implementação são normais e esperadas; ataques pessoais não são.

## Licença

Ao contribuir, você concorda que sua contribuição é licenciada sob a [licença MIT](./LICENSE) deste projeto.
