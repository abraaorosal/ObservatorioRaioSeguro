# Technology Stack

**Analysis Date:** 2026-04-15

## Languages

**Primary:**
- TypeScript (5.x via `typescript` ^5.7.2) - aplicação frontend em `src/**/*.ts` e `src/**/*.tsx`

**Secondary:**
- JavaScript (ES Modules) - configuração em `postcss.config.js` e `tailwind.config.js`
- HTML5 - shell da aplicação em `index.html`
- CSS (Tailwind + CSS padrão) - importado por `src/main.tsx` (`./index.css`)

## Runtime

**Environment:**
- Node.js - runtime de build/dev para `vite`, `tsc`, `postcss` e `tailwindcss` (versão não fixada em `.nvmrc`, não detectada)
- Navegador moderno - runtime de execução do app React gerado em `dist/`

**Package Manager:**
- npm (scripts e lockfile npm)
- Lockfile: present (`package-lock.json`)

## Frameworks

**Core:**
- React (^18.3.1) - UI principal iniciada em `src/main.tsx` e `src/App.tsx`
- Vite (^7.3.2) - bundler/dev server configurado em `vite.config.ts`

**Testing:**
- Not detected (sem `jest.config.*`, `vitest.config.*` ou dependências de teste em `package.json`)

**Build/Dev:**
- TypeScript (^5.7.2) - checagem de tipos via script `build` em `package.json`
- Tailwind CSS (^3.4.17) - design tokens e utilitários em `tailwind.config.js`
- PostCSS (^8.4.49) + Autoprefixer (^10.4.20) - pipeline CSS em `postcss.config.js`
- `@vitejs/plugin-react` (^5.2.0) - plugin React no Vite em `vite.config.ts`

## Key Dependencies

**Critical:**
- `react` (^18.3.1) - base de renderização declarativa da interface em `src/main.tsx`
- `react-dom` (^18.3.1) - bootstrap do root React em `src/main.tsx`
- `recharts` (^2.13.3) - visualizações analíticas em `src/components/AnalyticalChart.tsx`
- `lucide-react` (^0.468.0) - ícones institucionais em componentes como `src/components/FilterBar.tsx`

**Infrastructure:**
- `vite` (^7.3.2) - build/serve do frontend (`package.json` scripts)
- `typescript` (^5.7.2) - tipagem estática (`tsconfig.json`)
- `tailwindcss` (^3.4.17), `postcss` (^8.4.49), `autoprefixer` (^10.4.20) - toolchain de estilos

## Configuration

**Environment:**
- Configuração por arquivo e build-time; não há uso de `import.meta.env`/`process.env` no código de `src/`
- Arquivos `.env*`: não detectados na raiz do projeto
- Dados de domínio carregados localmente de `sinistro_transito.json` via `src/data/loadSinistros.ts`

**Build:**
- `vite.config.ts` - configuração do bundler e plugin React
- `tsconfig.json` + `tsconfig.node.json` - configuração TypeScript
- `postcss.config.js` e `tailwind.config.js` - configuração do pipeline CSS
- `index.html` - ponto de entrada HTML com `src/main.tsx`

## Platform Requirements

**Development:**
- Node.js com npm
- Dependências instaladas em `node_modules/`
- Execução via scripts `npm run dev` e `npm run build` (`package.json`)

**Production:**
- Hosting estático para pasta `dist/` (provider específico não detectado)
- Sem backend próprio detectado no repositório

---

*Stack analysis: 2026-04-15*
