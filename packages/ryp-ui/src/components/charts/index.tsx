/**
 * RYP Chart Wrappers
 *
 * Thin wrappers around Recharts components that apply consistent dark-theme
 * defaults. Import these instead of raw Recharts components to stay on-brand.
 */

import React from 'react';
import {
  LineChart as ReLineChart,
  BarChart as ReBarChart,
  AreaChart as ReAreaChart,
  RadarChart as ReRadarChart,
  PieChart as RePieChart,
  Line,
  Bar,
  Area,
  Radar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend as ReLegend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  type TooltipProps,
} from 'recharts';
import { RYP_COLORS, CHART_COLORS } from '../../theme';
import { cn } from '../../lib/cn';

// ── Shared defaults ────────────────────────────────────────────────────────

const AXIS_STYLE = {
  tick:  { fill: RYP_COLORS.gray500, fontSize: 11, fontFamily: 'Work Sans, sans-serif' },
  axisLine:  { stroke: 'rgba(255,255,255,0.08)' },
  tickLine:  { stroke: 'transparent' },
};

const GRID_STYLE = {
  strokeDasharray: '3 3',
  stroke: 'rgba(255,255,255,0.06)',
  vertical: false,
};

// ── Custom Tooltip ─────────────────────────────────────────────────────────

interface RypTooltipProps extends TooltipProps<number, string> {
  valueFormatter?: (value: number) => string;
}

export function RypTooltip({ active, payload, label, valueFormatter }: RypTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-ryp-surface-2/95 backdrop-blur-md p-3 shadow-ryp-lg">
      {label && (
        <p className="text-xs font-medium text-white/50 mb-2 font-body">{String(label)}</p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color ?? CHART_COLORS[i % CHART_COLORS.length] }}
            aria-hidden="true"
          />
          <span className="text-white/60 font-body">{entry.name}:</span>
          <span className="font-semibold text-white font-body tabular-nums">
            {valueFormatter && typeof entry.value === 'number'
              ? valueFormatter(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── RypLineChart ───────────────────────────────────────────────────────────

export interface LineSeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
  strokeWidth?: number;
  dot?: boolean;
}

export interface RypLineChartProps {
  data: Record<string, unknown>[];
  series: LineSeriesConfig[];
  xKey: string;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  valueFormatter?: (v: number) => string;
  className?: string;
}

export function RypLineChart({
  data,
  series,
  xKey,
  height = 300,
  valueFormatter,
  className,
}: RypLineChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={xKey} {...AXIS_STYLE} />
          <YAxis {...AXIS_STYLE} width={36} />
          <ReTooltip
            content={<RypTooltip valueFormatter={valueFormatter} />}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
          />
          {series.map((s, i) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              stroke={s.color ?? CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={s.strokeWidth ?? 2}
              dot={s.dot ?? false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── RypBarChart ────────────────────────────────────────────────────────────

export interface BarSeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
  radius?: number;
}

export interface RypBarChartProps {
  data: Record<string, unknown>[];
  series: BarSeriesConfig[];
  xKey: string;
  height?: number;
  valueFormatter?: (v: number) => string;
  stacked?: boolean;
  className?: string;
}

export function RypBarChart({
  data,
  series,
  xKey,
  height = 300,
  valueFormatter,
  stacked = false,
  className,
}: RypBarChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={xKey} {...AXIS_STYLE} />
          <YAxis {...AXIS_STYLE} width={36} />
          <ReTooltip
            content={<RypTooltip valueFormatter={valueFormatter} />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          {series.map((s, i) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              fill={s.color ?? CHART_COLORS[i % CHART_COLORS.length]}
              radius={[s.radius ?? 4, s.radius ?? 4, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── RypAreaChart ───────────────────────────────────────────────────────────

export interface AreaSeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
  fillOpacity?: number;
}

export interface RypAreaChartProps {
  data: Record<string, unknown>[];
  series: AreaSeriesConfig[];
  xKey: string;
  height?: number;
  valueFormatter?: (v: number) => string;
  className?: string;
}

export function RypAreaChart({
  data,
  series,
  xKey,
  height = 300,
  valueFormatter,
  className,
}: RypAreaChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <defs>
            {series.map((s, i) => {
              const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length] ?? '#00af51';
              return (
                <linearGradient key={s.dataKey} id={`grad-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey={xKey} {...AXIS_STYLE} />
          <YAxis {...AXIS_STYLE} width={36} />
          <ReTooltip
            content={<RypTooltip valueFormatter={valueFormatter} />}
            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          {series.map((s, i) => {
            const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length] ?? '#00af51';
            return (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name ?? s.dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${s.dataKey})`}
                fillOpacity={s.fillOpacity ?? 1}
              />
            );
          })}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── RypRadarChart ──────────────────────────────────────────────────────────

export interface RadarSeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
  fillOpacity?: number;
}

export interface RypRadarChartProps {
  data: Record<string, unknown>[];
  series: RadarSeriesConfig[];
  /** The key in data that names each axis */
  angleKey: string;
  height?: number;
  className?: string;
}

export function RypRadarChart({
  data,
  series,
  angleKey,
  height = 300,
  className,
}: RypRadarChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey={angleKey}
            tick={{ fill: RYP_COLORS.gray500, fontSize: 11, fontFamily: 'Work Sans, sans-serif' }}
          />
          <PolarRadiusAxis
            tick={{ fill: RYP_COLORS.gray600, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <ReTooltip content={<RypTooltip />} />
          {series.map((s, i) => {
            const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length] ?? '#00af51';
            return (
              <Radar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name ?? s.dataKey}
                stroke={color}
                fill={color}
                fillOpacity={s.fillOpacity ?? 0.15}
              />
            );
          })}
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── RypPieChart ────────────────────────────────────────────────────────────

export interface PieDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface RypPieChartProps {
  data: PieDataItem[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  valueFormatter?: (v: number) => string;
  className?: string;
}

export function RypPieChart({
  data,
  height = 260,
  innerRadius = 60,
  outerRadius = 100,
  valueFormatter,
  className,
}: RypPieChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <ReTooltip content={<RypTooltip valueFormatter={valueFormatter} />} />
          <ReLegend
            formatter={(value) => (
              <span style={{ color: RYP_COLORS.gray400, fontSize: 12, fontFamily: 'Work Sans, sans-serif' }}>
                {value}
              </span>
            )}
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Re-export recharts primitives so apps don't need to import recharts directly
export { ResponsiveContainer };
