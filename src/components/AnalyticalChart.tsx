import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS, CHART_PALETTE } from '../constants/charts';
import type { ChartDatum, TimeSeriesDatum } from '../types/sinistro';
import { formatNumber, formatPercent, truncateText } from '../utils/formatters';
import { EmptyState } from './EmptyState';

function hasData(data: Array<{ value: number }>) {
  return data.some((item) => item.value > 0);
}

const tooltipFormatter = (value: number, name: string, payload: { payload?: ChartDatum }) => {
  const percent = payload.payload?.percent;
  const suffix = typeof percent === 'number' ? ` (${formatPercent(percent)})` : '';
  return [`${formatNumber(Number(value))}${suffix}`, name];
};

export function VerticalBar({ data, color = CHART_COLORS.primary }: { data: ChartDatum[]; color?: string }) {
  if (!hasData(data)) {
    return <EmptyState title="Sem dados para o gráfico" description="O recorte atual não possui valores agregáveis." />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 32 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} vertical={false} />
        <XAxis
          dataKey="name"
          interval={0}
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => truncateText(String(value), 18)}
          angle={-24}
          textAnchor="end"
          height={70}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip formatter={tooltipFormatter} />
        <Bar dataKey="value" name="Registros" fill={color} radius={[6, 6, 0, 0]} isAnimationActive={false}>
          <LabelList dataKey="value" position="top" fontSize={11} fill="#123c34" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBar({ data, color = CHART_COLORS.primary }: { data: ChartDatum[]; color?: string }) {
  if (!hasData(data)) {
    return <EmptyState title="Sem dados para o gráfico" description="O recorte atual não possui valores agregáveis." />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="name"
          width={128}
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => truncateText(String(value), 18)}
        />
        <Tooltip formatter={tooltipFormatter} />
        <Bar dataKey="value" name="Registros" fill={color} radius={[0, 6, 6, 0]} isAnimationActive={false}>
          <LabelList dataKey="value" position="right" fontSize={11} fill="#123c34" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data }: { data: ChartDatum[] }) {
  if (!hasData(data)) {
    return <EmptyState title="Sem dados para o gráfico" description="O recorte atual não possui valores agregáveis." />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip formatter={tooltipFormatter} />
        <Legend verticalAlign="bottom" height={48} iconType="square" wrapperStyle={{ fontSize: 12 }} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="43%"
          innerRadius={52}
          outerRadius={82}
          paddingAngle={2}
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TemporalLine({ data }: { data: TimeSeriesDatum[] }) {
  if (!hasData(data)) {
    return <EmptyState title="Sem dados temporais" description="O recorte atual não possui datas válidas." />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 22, left: 0, bottom: 32 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          interval="preserveStartEnd"
          angle={-24}
          textAnchor="end"
          height={70}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [formatNumber(Number(value)), 'Sinistros']} />
        <Line
          type="monotone"
          dataKey="value"
          name="Sinistros"
          stroke={CHART_COLORS.primary}
          strokeWidth={3}
          dot={{ r: 3, strokeWidth: 2 }}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MatrixBar({ data }: { data: ChartDatum[] }) {
  if (!hasData(data)) {
    return <EmptyState title="Sem dados para matriz" description="O recorte atual não possui valores agregáveis." />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 36 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} vertical={false} />
        <XAxis
          dataKey="name"
          interval={0}
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => truncateText(String(value), 18)}
          angle={-24}
          textAnchor="end"
          height={76}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip formatter={tooltipFormatter} />
        <Bar dataKey="value" name="Registros" radius={[6, 6, 0, 0]} isAnimationActive={false}>
          {data.map((entry, index) => (
            <Cell key={`bar-${entry.name}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
          ))}
          <LabelList dataKey="value" position="top" fontSize={11} fill="#123c34" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
