import { COLORS } from './colors';

interface TooltipProps {
  active?: boolean;
  name: string;
  kpi: number;
  kpiLabel: string;
  colorKPI?: number;
  coloringLabel?: string;
}

// Custom tooltip for detailed info
export function StatsTooltip({ active, name, kpi, kpiLabel, colorKPI, coloringLabel }: TooltipProps) {
  if (active) {
    return (
      <div style={{ background: COLORS.elevation5, color: COLORS.text, borderRadius: 6, padding: '10px 14px', boxShadow: `0 2px 8px ${COLORS.elevation5}`, fontSize: 13, lineHeight: 1.5 }}>
        <div><strong>Name:</strong> {name}</div>
        <div><strong>{kpiLabel}:</strong> {kpi.toFixed(2)}</div>
        {coloringLabel && colorKPI && (
          <div><strong>{coloringLabel}:</strong> {colorKPI.toFixed(2)}</div>
        )}
      </div>
    );
  }
  return null;
}
