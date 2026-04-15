# Architecture

**Analysis Date:** 2026-04-15

## Pattern Overview

**Overall:** Single-page frontend architecture with feature-oriented composition and utility-driven domain processing.

**Key Characteristics:**
- Route-free SPA entry (`src/main.tsx` -> `src/App.tsx` -> `src/pages/DashboardPage.tsx`).
- Domain pipeline split into ingestion (`src/data/loadSinistros.ts`), normalization (`src/utils/normalization.ts`), and analytics (`src/utils/analytics.ts`).
- Presentation split into reusable UI primitives in `src/components/` and domain sections in `src/sections/`.

## Layers

**Application Bootstrap Layer:**
- Purpose: Mount React app and global styles.
- Location: `src/main.tsx`, `src/App.tsx`, `src/index.css`.
- Contains: Root render, strict mode, global CSS/Tailwind directives.
- Depends on: React runtime, page layer.
- Used by: Browser entry from `index.html`.

**Page Orchestration Layer:**
- Purpose: Compose complete dashboard screen and control loading/error/empty/content branches.
- Location: `src/pages/DashboardPage.tsx`.
- Contains: Page shell, section ordering, conditional rendering.
- Depends on: `src/hooks/useSinistroDashboard` (imported), `src/components/*`, `src/sections/*`.
- Used by: `src/App.tsx`.

**Domain Data Layer:**
- Purpose: Load, normalize, aggregate, filter, and format domain records.
- Location: `src/data/loadSinistros.ts`, `src/utils/normalization.ts`, `src/utils/analytics.ts`, `src/types/sinistro.ts`.
- Contains: Dataset ingestion, record normalization, KPI/risk/quality calculations, filtering utilities, domain type contracts.
- Depends on: Root dataset file `sinistro_transito.json`, constants from `src/constants/filters.ts`.
- Used by: Dashboard hook and rendering sections/components.

**Presentation Layer:**
- Purpose: Render reusable UI blocks, charts, and dashboard sections.
- Location: `src/components/`, `src/sections/`.
- Contains: Chart wrappers, table, filter bar, section containers, executive summary and analysis sections.
- Depends on: Domain output objects from analytics and type contracts.
- Used by: Page orchestration layer.

**Configuration Layer:**
- Purpose: Keep static metadata, visual tokens, and toolchain settings centralized.
- Location: `src/constants/`, `tailwind.config.js`, `postcss.config.js`, `vite.config.ts`, `tsconfig.json`.
- Contains: Section IDs, filter defaults/labels, chart palette, access profile placeholders, build/style/compiler setup.
- Depends on: None (source of truth for consumers).
- Used by: Components, sections, utilities, build pipeline.

## Data Flow

**Dashboard Analytical Flow:**

1. Browser loads `index.html` and executes `src/main.tsx`.
2. `src/App.tsx` renders `src/pages/DashboardPage.tsx`.
3. Page requests dashboard state from imported hook path `src/hooks/useSinistroDashboard`.
4. Data loader `src/data/loadSinistros.ts` reads `sinistro_transito.json` and maps each row using `normalizeSinistro` from `src/utils/normalization.ts`.
5. Analytics functions in `src/utils/analytics.ts` derive filtered records, KPIs, summaries, and chart series.
6. Page passes typed props into sections (`src/sections/*.tsx`) and components (`src/components/*.tsx`).
7. Components render interactive filters, charts (`src/components/AnalyticalChart.tsx`), and table/export/report actions.

**State Management:**
- Local React state + memoization is implemented in leaf components such as `src/components/DataTable.tsx`.
- Central dashboard state is expected in `src/hooks/useSinistroDashboard` (imported by page, file not detected in current tree).

## Key Abstractions

**Normalized Domain Record (`NormalizedSinistro`):**
- Purpose: Canonical, presentation-ready contract for each sinistro row.
- Examples: `src/types/sinistro.ts`, produced in `src/utils/normalization.ts`.
- Pattern: Normalize once, consume everywhere; avoid raw workbook fields in UI.

**Analytical Aggregation Functions:**
- Purpose: Build all dashboard metrics/series from normalized records.
- Examples: `calculateKpis`, `calculateRiskSummary`, `calculateQualitySummary`, `filterRecords` in `src/utils/analytics.ts`.
- Pattern: Pure functions with typed IO, no component-side business logic duplication.

**Section-Oriented Composition:**
- Purpose: Keep page readable by delegating each analytical block to a section component.
- Examples: `src/sections/ExecutiveSummarySection.tsx`, `src/sections/OverviewSection.tsx`, `src/sections/RiskFactorsSection.tsx`.
- Pattern: Page orchestrates, sections present domain slices, components provide reusable primitives.

## Entry Points

**HTML Entrypoint:**
- Location: `index.html`
- Triggers: HTTP request for SPA.
- Responsibilities: Provides root mount node and module script reference `/src/main.tsx`.

**React Entrypoint:**
- Location: `src/main.tsx`
- Triggers: Browser module execution.
- Responsibilities: Creates root, wraps app in `React.StrictMode`, loads global styles.

**Application Root:**
- Location: `src/App.tsx`
- Triggers: Render by React root.
- Responsibilities: Selects top-level page (`DashboardPage`) without router layer.

**Dashboard Screen Entrypoint:**
- Location: `src/pages/DashboardPage.tsx`
- Triggers: Render from `App`.
- Responsibilities: Requests dashboard state, handles UI states (loading/error/empty), composes analytical sections.

## Error Handling

**Strategy:** Fail fast on invalid dataset shape and surface user-facing fallback at page level.

**Patterns:**
- Data ingestion throws explicit error when worksheet path is missing (`src/data/loadSinistros.ts`).
- Page-level fallback UI displays operational guidance when hook returns `error` (`src/pages/DashboardPage.tsx`).

## Cross-Cutting Concerns

**Logging:** Not detected (no dedicated logging module in `src/`).
**Validation:** Runtime dataset shape checks in `src/data/loadSinistros.ts` plus normalization guards in `src/utils/normalization.ts`.
**Authentication:** Not applicable in current frontend-only architecture (no auth flow detected in `src/`).

---

*Architecture analysis: 2026-04-15*
