# External Integrations

**Analysis Date:** 2026-04-15

## APIs & External Services

**HTTP APIs:**
- Not detected - não há chamadas `fetch`, `axios` ou clients de API em `src/`
  - SDK/Client: Not applicable
  - Auth: Not applicable

**Third-party SDKs:**
- Not detected - imports externos em `src/` são bibliotecas de UI/chart (`react`, `recharts`, `lucide-react`)
  - SDK/Client: Not applicable
  - Auth: Not applicable

## Data Storage

**Databases:**
- Not detected
  - Connection: Not applicable
  - Client: Not applicable

**File Storage:**
- Local filesystem only - dados consumidos de `sinistro_transito.json` por `src/data/loadSinistros.ts`

**Caching:**
- None (nenhuma camada de cache dedicada detectada)

## Authentication & Identity

**Auth Provider:**
- Custom: Not applicable (aplicação sem fluxo de autenticação detectado)
  - Implementation: Not detected em `src/`

## Monitoring & Observability

**Error Tracking:**
- None (nenhum Sentry, Datadog, Bugsnag ou equivalente detectado)

**Logs:**
- Browser/runtime padrão; estratégia de observabilidade dedicada não detectada

## CI/CD & Deployment

**Hosting:**
- Not detected (somente artefato estático em `dist/`)

**CI Pipeline:**
- None detectado (`.github/workflows/` não encontrado)

## Environment Configuration

**Required env vars:**
- Not detected (sem uso de `process.env` ou `import.meta.env` no repositório)

**Secrets location:**
- Not applicable para a implementação atual (sem integrações externas com segredo detectadas)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-04-15*
