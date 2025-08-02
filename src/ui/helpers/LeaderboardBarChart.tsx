/**
 * Renders a vertical bar chart for KPI data using Recharts.
 *
 * @param data - The chart data containing entries and color coding information.
 * @param kpiLabel - The label to display for the KPI values in the tooltip.
 * @param coloringLabel - (Optional) The label for the color-coded KPI in the tooltip. Defaults to 'Color KPI'.
 * @param yAxisWidth - (Optional) The width of the Y axis. Defaults to 90.
 *
 * The chart supports color-coding bars based on a secondary KPI value (`colorCodingKpi`).
 * Tooltips display detailed information for each bar, including the KPI and color KPI values.
 */
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ChartData, ChartEntry } from '../../utils/types/ChartData';
import { getKpiBarColor } from '../../utils/kpiColor';
import { StatsTooltip } from './Tooltip';
import { COLORS } from './colors';
import { yAxisStyle, xAxisStyle, getXAxisMax } from './chartHelpers';
import { Watermark } from './Watermark';

interface LeaderboardBarChartProps {
  data: ChartData;
  kpiLabel: string;
  coloringLabel?: string;
  yAxisWidth?: number;
  yAxisFontSize?: number;
  xAxisFontSize?: number;
  disableAnimation?: boolean; // Optional prop to disable animation
}

export function LeaderboardBarChart({
  data,
  kpiLabel,
  coloringLabel = 'Color KPI',
  yAxisWidth = 90,
  yAxisFontSize,
  xAxisFontSize,
  disableAnimation = false,
}: LeaderboardBarChartProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} aria-label="Leaderboard Bar Chart" role="region">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.entries}
          layout="vertical"
          margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
        >
          <YAxis
            type="category"
            dataKey="name"
            width={yAxisWidth}
            axisLine={false}
            tickLine={false}
            tick={{ ...yAxisStyle, fontSize: yAxisFontSize ?? yAxisStyle.fontSize }}
          />
          <XAxis
            type="number"
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ ...xAxisStyle, fontSize: xAxisFontSize ?? xAxisStyle.fontSize }}
            domain={[0, getXAxisMax(data.entries, 'kpi')]}
          />
          <Bar dataKey="kpi" radius={[0, 3, 3, 0]} label={{ position: 'right' }} isAnimationActive={!disableAnimation}>
            {data.entries.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={
                  entry.colorCodingKpi !== undefined
                    ? getKpiBarColor(
                        entry.colorCodingKpi ?? 0,
                        data.colorCodingMin ?? 0,
                        data.colorCodingMax ?? 0
                      )
                    : COLORS.primary // fallback/default color
                }
              />
            ))}
          </Bar>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const d = payload[0].payload as ChartEntry;
              return (
                <StatsTooltip
                  active={active}
                  name={d.name}
                  kpi={d.kpi}
                  kpiLabel={kpiLabel}
                  colorKPI={d.colorCodingKpi}
                  coloringLabel={coloringLabel}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      {disableAnimation && <Watermark />}
    </div>
  );
}