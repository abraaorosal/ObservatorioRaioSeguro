# Coding Conventions

**Analysis Date:** 2026-04-15

## Naming Patterns

**Files:**
- Componentes React em PascalCase no diretório `src/components/` (ex.: `src/components/DataTable.tsx`, `src/components/KPICard.tsx`).
- Seções de página em PascalCase no diretório `src/sections/` (ex.: `src/sections/OverviewSection.tsx`, `src/sections/RiskFactorsSection.tsx`).
- Utilitários em camelCase no diretório `src/utils/` (ex.: `src/utils/analytics.ts`, `src/utils/normalization.ts`).
- Constantes em camelCase ou domínio semântico no diretório `src/constants/` (ex.: `src/constants/filters.ts`, `src/constants/charts.ts`).
- Tipos centralizados em `src/types/sinistro.ts`.

**Functions:**
- Use camelCase para funções e helpers (`calculateKpis`, `normalizeSinistro`, `downloadExecutiveReport`).
- Componentes React exportados como `function` nomeada em PascalCase (`DataTable`, `FilterBar`, `DashboardPage`).
- Helpers internos não exportados permanecem no escopo do módulo com camelCase (`escapeCsv`, `clamp`, `riskLevelFromScore`).

**Variables:**
- Use camelCase para variáveis locais e estados React (`filteredRecords`, `showSensitiveData`, `sortDirection`).
- Use UPPER_SNAKE_CASE para constantes de módulo (`PAGE_SIZE`, `CSV_COLUMNS`, `EMPTY_VALUES`).
- Use nomes de domínio em português quando representam os dados de origem (`dias_lts`, `situacao_sinistro`, `poderiaSerEvitado`).

**Types:**
- Use `interface` e `type` com PascalCase (`NormalizedSinistro`, `FilterState`, `RiskSummary` em `src/types/sinistro.ts`).
- Use aliases literais para domínios fechados (`RiskLevel`, `SortDirection`, `SortKey` em `src/types/sinistro.ts`).

## Code Style

**Formatting:**
- Tool used: Not detected (nenhum Prettier/Biome configurado por arquivo dedicado).
- Key settings inferidas do código:
  - Aspas simples em TS/TSX (`src/main.tsx`, `src/utils/analytics.ts`).
  - Ponto e vírgula obrigatório.
  - Vírgula final em listas multiline.
  - Indentação com 2 espaços.
  - JSX com quebras de linha para props longas (`src/components/DataTable.tsx`).

**Linting:**
- Tool used: Not detected (sem `.eslintrc*` e sem `eslint.config.*` no repositório).
- Key rules: Não há regras de lint versionadas; consistência é mantida por padrão manual de código.

## Import Organization

**Order:**
1. Dependências externas primeiro (`react`, `lucide-react`, `recharts`) em arquivos como `src/components/DataTable.tsx` e `src/sections/OverviewSection.tsx`.
2. Tipos e constantes internas depois (`../types/sinistro`, `../constants/*`).
3. Utilitários e componentes locais por último (`../utils/*`, `./Badge`, `./EmptyState`).

**Path Aliases:**
- Not detected (apenas imports relativos como `../utils/analytics` e `./index.css`).

## Error Handling

**Patterns:**
- Fail-fast em carga de dados com `throw new Error(...)` em `src/data/loadSinistros.ts`.
- Guard clauses para evitar divisão por zero e listas vazias em `src/utils/analytics.ts`.
- Tratamento de estado de erro na UI com renderização condicional em `src/pages/DashboardPage.tsx`.
- Ausência de blocos `try/catch` no `src/`: erro é propagado para nível superior de consumo.

## Logging

**Framework:** None (nenhum `console.*` detectado em `src/`).

**Patterns:**
- Não há logging de runtime implementado.
- O padrão atual privilegia exibição de erro para usuário final (`DashboardPage`) em vez de telemetria.

## Comments

**When to Comment:**
- Comentários inline praticamente ausentes; código tende a ser autoexplicativo por nomenclatura semântica.
- O uso de comentários não é padrão recorrente no `src/`.

**JSDoc/TSDoc:**
- Not detected (sem blocos JSDoc/TSDoc nos módulos analisados, como `src/utils/analytics.ts` e `src/utils/normalization.ts`).

## Function Design

**Size:** 
- Funções utilitárias pequenas e focadas em `src/utils/formatters.ts`, `src/utils/privacy.ts`.
- Funções agregadoras longas em módulos analíticos (`buildStrategicInsights` e `calculateQualitySummary` em `src/utils/analytics.ts`).
- Componentes de UI extensos com múltiplas responsabilidades visuais (`src/components/DataTable.tsx`, `src/components/FilterBar.tsx`).

**Parameters:** 
- Use objetos tipados para contratos de componente (`FilterBarProps`, `OverviewSectionProps`).
- Use parâmetros posicionais em helpers numéricos (`percent(part, total)`, `average(sum, total)`).
- Use objeto opcional para configuração incremental (`recordsToCsv(records, options)` em `src/utils/csv.ts`).

**Return Values:** 
- Funções utilitárias retornam tipos explícitos (`number`, `string`, arrays tipados).
- Componentes React retornam JSX e aplicam early return para estados de carregamento/erro (`src/pages/DashboardPage.tsx`).

## Module Design

**Exports:** 
- Prefira exports nomeados para quase todos os módulos (`src/utils/analytics.ts`, `src/components/*`).
- `default export` aparece apenas na composição raiz em `src/App.tsx`.

**Barrel Files:** 
- Not used (sem `index.ts` de agregação em `src/components/`, `src/utils/` ou `src/sections/`).

---

*Convention analysis: 2026-04-15*
