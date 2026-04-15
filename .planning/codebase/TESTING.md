# Testing Patterns

**Analysis Date:** 2026-04-15

## Test Framework

**Runner:**
- Not detected (sem Vitest/Jest/Mocha configurado em `package.json` e sem `vitest.config.*`/`jest.config.*`).
- Config: Not detected.

**Assertion Library:**
- Not detected (nenhuma dependência de `expect`/`chai`/`@testing-library` encontrada no código-fonte).

**Run Commands:**
```bash
npm run dev              # Executa ambiente local (não há comando de teste)
npm run build            # Verifica TypeScript via tsc --noEmit e gera build
npm run preview          # Serve build de produção localmente
```

## Test File Organization

**Location:**
- Not detected (não há arquivos `*.test.*` ou `*.spec.*` no projeto).

**Naming:**
- Not detected.

**Structure:**
```
Nenhuma estrutura de testes automatizados detectada no repositório.
```

## Test Structure

**Suite Organization:**
```typescript
// Não aplicável: não existem suites describe/it/test no código atual.
```

**Patterns:**
- Setup pattern: Not detected.
- Teardown pattern: Not detected.
- Assertion pattern: Not detected.

## Mocking

**Framework:** Not detected.

**Patterns:**
```typescript
// Não aplicável: nenhum padrão de mock (vi.mock/jest.mock) encontrado.
```

**What to Mock:**
- Ao introduzir testes unitários, mockar fronteiras externas de browser/API: `URL.createObjectURL`, `Blob`, `document.createElement` em `src/utils/csv.ts` e `src/utils/report.ts`.
- Mockar carga de dataset bruto em `src/data/loadSinistros.ts` para validar cenários de erro/entrada inválida.

**What NOT to Mock:**
- Não mockar lógica pura de domínio em `src/utils/analytics.ts` e `src/utils/normalization.ts`; testar com dados determinísticos.
- Não mockar transformações de formatação de `src/utils/formatters.ts`, pois são funções puras e baratas.

## Fixtures and Factories

**Test Data:**
```typescript
// Padrão recomendado a partir dos tipos existentes:
// Usar factories tipadas com base em `RawSinistro` e `NormalizedSinistro`
// definidos em `src/types/sinistro.ts`.
```

**Location:**
- Not detected (sem diretório de fixtures atual).
- Local recomendado ao adicionar testes: `src/test/fixtures/` ou co-localizado por módulo (ex.: `src/utils/__tests__/fixtures.ts`).

## Coverage

**Requirements:** None enforced (nenhuma meta de cobertura configurada).

**View Coverage:**
```bash
# Not detected: sem comando de cobertura no estado atual.
```

## Test Types

**Unit Tests:**
- Não utilizados atualmente.
- Priorizar cobertura de funções puras em `src/utils/analytics.ts`, `src/utils/normalization.ts`, `src/utils/formatters.ts` e `src/utils/privacy.ts`.

**Integration Tests:**
- Não utilizados atualmente.
- Cenários críticos para futuro: fluxo `loadSinistrosFromWorkbook` -> `normalizeSinistro` -> `calculateKpis`/`calculateRiskSummary`.

**E2E Tests:**
- Not used (nenhuma configuração de Playwright/Cypress detectada).

## Common Patterns

**Async Testing:**
```typescript
// Não aplicável no estado atual.
// Fluxos existentes são predominantemente síncronos no `src/`.
```

**Error Testing:**
```typescript
// Cenário recomendado com base no código existente:
// expect(() => loadSinistrosFromWorkbook()).toThrow(
//   'A planilha sinistro_transito não foi localizada no arquivo JSON.'
// );
```

---

*Testing analysis: 2026-04-15*
