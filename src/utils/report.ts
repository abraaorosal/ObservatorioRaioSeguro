import type {
  DatasetSummary,
  ExecutiveSummary,
  KpiSummary,
  QualitySummary,
  RiskSummary,
  StrategicInsight,
} from '../types/sinistro';
import { formatDatePtBr, formatDecimal, formatNumber, formatPercent, formatPeriod } from './formatters';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildExecutiveReportHtml({
  summary,
  kpis,
  risk,
  quality,
  executiveSummary,
  insights,
}: {
  summary: DatasetSummary;
  kpis: KpiSummary;
  risk: RiskSummary;
  quality: QualitySummary;
  executiveSummary: ExecutiveSummary;
  insights: StrategicInsight[];
}) {
  const issuedAt = formatDatePtBr(new Date());
  const items = executiveSummary.items
    .map(
      (item) => `
        <article>
          <strong>${escapeHtml(item.label)}</strong>
          <span>${escapeHtml(item.value)}</span>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `,
    )
    .join('');
  const insightRows = insights
    .map(
      (insight) => `
        <tr>
          <td>${escapeHtml(insight.category)}</td>
          <td>${escapeHtml(insight.priority)}</td>
          <td><strong>${escapeHtml(insight.title)}</strong><br />${escapeHtml(insight.description)}</td>
        </tr>
      `,
    )
    .join('');
  const qualityRows = quality.metrics
    .map(
      (metric) => `
        <tr>
          <td>${escapeHtml(metric.field)}</td>
          <td>${formatNumber(metric.missing)} de ${formatNumber(metric.total)}</td>
          <td>${formatPercent(metric.percent)}</td>
          <td>${escapeHtml(metric.status)}</td>
        </tr>
      `,
    )
    .join('');

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Relatório Executivo RAIO Seguro</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #08261d; line-height: 1.45; }
    header { border-bottom: 4px solid #f26a21; padding-bottom: 18px; margin-bottom: 24px; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    h2 { margin-top: 28px; color: #007f5f; font-size: 20px; }
    .meta { color: #50615c; font-size: 13px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    article { border: 1px solid #d7e6df; border-radius: 8px; padding: 14px; background: #f3f8f5; }
    article strong { display: block; color: #50615c; font-size: 12px; text-transform: uppercase; }
    article span { display: block; margin-top: 6px; font-size: 22px; font-weight: 700; }
    article p { margin: 8px 0 0; font-size: 13px; color: #50615c; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #d7e6df; padding: 9px; vertical-align: top; font-size: 13px; }
    th { background: #f3f8f5; text-align: left; }
    .risk { font-size: 18px; font-weight: 700; }
    @media print { body { margin: 18mm; } }
  </style>
</head>
<body>
  <header>
    <p class="meta">Governo do Estado do Ceará | Polícia Militar do Ceará | CPRAIO</p>
    <h1>Relatório Executivo de Sinistros de Trânsito</h1>
    <p class="meta">Programa RAIO SEGURO - emitido em ${issuedAt}</p>
    <p class="meta">Período: ${formatPeriod(summary.startDate, summary.endDate)} | Registros no recorte: ${formatNumber(summary.totalFiltered)}</p>
  </header>

  <h2>Resumo Executivo</h2>
  <section class="grid">${items}</section>

  <h2>Índice de Risco Operacional</h2>
  <p class="risk">${escapeHtml(risk.level)} - ${risk.score}/100</p>
  <p>${escapeHtml(risk.description)}</p>
  <ul>${risk.drivers.map((driver) => `<li>${escapeHtml(driver)}</li>`).join('')}</ul>

  <h2>Indicadores Principais</h2>
  <table>
    <tbody>
      <tr><th>Total de sinistros</th><td>${formatNumber(kpis.total)}</td></tr>
      <tr><th>Sinistros com lesão</th><td>${formatNumber(kpis.totalLesao)}</td></tr>
      <tr><th>Sinistros com LTS</th><td>${formatNumber(kpis.totalLts)}</td></tr>
      <tr><th>Fatalidades</th><td>${formatNumber(kpis.totalFatalidades)}</td></tr>
      <tr><th>Dias de LTS</th><td>${formatNumber(kpis.somaDiasLts)} dia(s), média de ${formatDecimal(kpis.mediaDiasLts)}</td></tr>
      <tr><th>Potencialmente evitáveis</th><td>${formatPercent(kpis.percentualEvitaveis)}</td></tr>
    </tbody>
  </table>

  <h2>Leituras Estratégicas e Recomendações</h2>
  <table>
    <thead><tr><th>Tipo</th><th>Prioridade</th><th>Leitura</th></tr></thead>
    <tbody>${insightRows}</tbody>
  </table>

  <h2>Qualidade da Base</h2>
  <p>Completude estimada: <strong>${formatPercent(quality.completeness)}</strong> (${quality.status}).</p>
  <table>
    <thead><tr><th>Campo</th><th>Ausentes</th><th>Percentual</th><th>Status</th></tr></thead>
    <tbody>${qualityRows}</tbody>
  </table>
</body>
</html>`;
}

export function downloadExecutiveReport(html: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio-executivo-raio-seguro-${new Date().toISOString().slice(0, 10)}.html`;
  link.click();
  URL.revokeObjectURL(url);
}
