## O que mudou

<!-- Descreva a mudança. Se for uma correção de bug, descreva o comportamento errado que ela corrige. -->

## Por quê

<!-- O que motivou essa mudança? -->

## Fonte oficial (obrigatório para qualquer regra fiscal/governamental brasileira)

<!-- Link ou referência: Receita Federal, Banco Central, Anatel, Correios, ou a documentação da SEFAZ correspondente. -->
<!-- Se esta PR não mexe em lógica de validação (docs, CI, refactor sem mudança de comportamento), escreva "N/A". -->

## Checklist

- [ ] Testes adicionados ou atualizados (uma correção de bug inclui um teste de regressão)
- [ ] O padrão `isValid` / `normalize` / `format` continua consistente com os validadores existentes
- [ ] Rodei o comando de teste de toda linguagem alterada (veja [`CONTRIBUTING.pt-BR.md`](../CONTRIBUTING.pt-BR.md#testes))
- [ ] Se o comportamento em TypeScript mudou, rodei `npm run generate-vectors` e rodei de novo o teste de conformidade de toda outra linguagem
