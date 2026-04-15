# Codebase Concerns

**Analysis Date:** 2026-04-15

## Tech Debt

**Camada de orquestracao do dashboard ausente no source:**
- Issue: `DashboardPage` depende de `useSinistroDashboard`, mas o arquivo fonte do hook nao existe no diretório `src/hooks`.
- Files: `src/pages/DashboardPage.tsx`, `src/hooks/`
- Impact: a base fica bloqueada para manutencao/evolucao porque a principal regra de negocio nao esta versionada no source atual.
- Fix approach: restaurar/criar `src/hooks/useSinistroDashboard.ts` com a composicao de carga, filtros e derivacoes (KPIs/charts), e cobrir com testes unitarios.

**Pipeline de build fragil no ambiente atual:**
- Issue: o script `build` depende de `tsc`, mas a execucao falha com `tsc: command not found`.
- Files: `package.json`
- Impact: entrega e validacao automatica ficam instaveis; regressao pode entrar sem cheque de tipos/build completo.
- Fix approach: garantir toolchain reprodutivel (`npm ci` limpo e verificacao de binarios em `node_modules/.bin`), com passo de CI para falhar cedo quando TypeScript nao estiver disponivel.

**Arquivo de lock duplicado no repositorio:**
- Issue: coexistem `package-lock.json` e `package-lock 2.json`.
- Files: `package-lock.json`, `package-lock 2.json`
- Impact: risco de divergencia de dependencias entre ambientes e troubleshooting mais caro.
- Fix approach: manter um unico lockfile canônico e remover o artefato duplicado do versionamento.

## Known Bugs

**Tela principal depende de modulo nao encontrado no source:**
- Symptoms: import de `../hooks/useSinistroDashboard` sem implementação local do modulo.
- Files: `src/pages/DashboardPage.tsx`, `src/hooks/`
- Trigger: qualquer tentativa de compilar/executar a partir do source atual.
- Workaround: inexistente no source atual; exige restauracao do hook.

**Falha de build por comando TypeScript indisponivel:**
- Symptoms: `npm run build` encerra com `sh: tsc: command not found`.
- Files: `package.json`
- Trigger: execucao de `npm run build`.
- Workaround: executar `vite build` isoladamente apenas para empacotamento (sem type-check), com risco residual.

## Security Considerations

**Exposicao manual de dado sensivel em UI e exportacao:**
- Risk: identificacao de policial pode ser exibida e exportada sem mascara quando usuario ativa `showSensitiveData`.
- Files: `src/components/DataTable.tsx`, `src/utils/csv.ts`
- Current mitigation: mascara ativada por padrao e opcao explicita para revelar.
- Recommendations: exigir confirmacao forte para revelar/exportar identificadores (ex.: modal de justificativa), registrar auditoria e separar permissao por perfil.

**Geracao de HTML exportavel no cliente:**
- Risk: relatorio HTML e construido dinamicamente; embora haja escaping, qualquer regressao nesse escape abre superficie para XSS em consumo posterior.
- Files: `src/utils/report.ts`
- Current mitigation: uso de `escapeHtml()` em campos textuais interpolados.
- Recommendations: manter escaping centralizado com testes de seguranca para payloads maliciosos e preferir formato nao executavel (PDF server-side ou HTML assinado) para compartilhamento externo.

## Performance Bottlenecks

**Processamento analitico totalmente client-side e em lote:**
- Problem: funcoes de agregacao/ordenacao percorrem o conjunto completo repetidamente para KPI, risco, qualidade e insights.
- Files: `src/utils/analytics.ts`
- Cause: estrategia baseada em multiplos `map/filter/sort/reduce` no frontend sem cache incremental por recorte.
- Improvement path: memoizar resultados por chave de filtro, consolidar passagens em pipelines unificadas e mover agregacoes pesadas para backend quando a base crescer.

**Busca e ordenacao da tabela escalam linear + n log n por interacao:**
- Problem: cada mudanca de busca/ordenacao reprocessa todos os registros antes da paginacao.
- Files: `src/components/DataTable.tsx`
- Cause: `filter` e `sort` em arrays completos dentro de `useMemo`, sem debounce e sem virtualizacao.
- Improvement path: aplicar debounce na busca, virtualizacao de linhas e indexacao textual para pesquisa.

## Fragile Areas

**Normalizacao semantica baseada em heuristica textual:**
- Files: `src/utils/normalization.ts`
- Why fragile: regras com sets/padroes textuais podem classificar incorretamente variacoes de preenchimento e gerar falso positivo/negativo em campos booleanos e categoricos.
- Safe modification: alterar regras com suite de casos reais de entrada/saida antes de mexer em `EMPTY_VALUES`, `YES_VALUES`, `NO_VALUES` e regex de conteudo.
- Test coverage: nao ha testes automatizados para as regras de normalizacao.

**Carga de dados acoplada a schema especifico unico:**
- Files: `src/data/loadSinistros.ts`, `sinistro_transito.json`
- Why fragile: leitura exige caminho fixo `workbook.sheets.sinistro_transito`; qualquer variacao de estrutura quebra o fluxo.
- Safe modification: introduzir camada de validacao de schema e fallback controlado antes da normalizacao.
- Test coverage: nao ha testes de contrato para formatos alternativos/invalidos de entrada.

## Scaling Limits

**Escalabilidade limitada por execucao local no browser:**
- Current capacity: adequada para volume pequeno/medio de registros em arquivo local.
- Limit: com crescimento do dataset, carga inicial, agregacoes e renderizacao de tabela tendem a degradar perceptivelmente.
- Scaling path: migrar para ingestao paginada/API, pre-agregacao no servidor e consulta incremental por filtros.

## Dependencies at Risk

**Toolchain sem verificacao automatizada minima:**
- Risk: ausenca de scripts de teste/lint e falha atual no type-check deixam regressao passar sem barreiras.
- Impact: maior chance de quebra funcional e tecnica em mudancas futuras.
- Migration plan: adicionar `test` e `lint` no `package.json`, configurar pipeline CI e bloquear merge sem build+checks.

## Missing Critical Features

**Camada de testes automatizados inexistente:**
- Problem: projeto nao possui suites `.test/.spec` para validacao de normalizacao, metricas e fluxo principal.
- Blocks: evolucao segura de regras analiticas e refatoracoes estruturais com baixo risco.

## Test Coverage Gaps

**Regras criticas de negocio sem cobertura:**
- What's not tested: parsing de data/numero, classificacao de risco, completude de dados, filtros e exportacoes CSV/HTML.
- Files: `src/utils/normalization.ts`, `src/utils/analytics.ts`, `src/utils/csv.ts`, `src/utils/report.ts`, `src/components/DataTable.tsx`
- Risk: alteracoes pequenas podem distorcer metricas oficiais sem deteccao precoce.
- Priority: High

---

*Concerns audit: 2026-04-15*
