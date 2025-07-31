import { COLORS } from './colors';

interface ColorLegendProps {
  min: number;
  max: number;
  label: string;
  idSuffix?: string;
}

/**
 * A reusable color legend panel for KPI color scales.
 * @param min The minimum value (left label)
 * @param max The maximum value (right label)
 * @param label The legend label (default: 'KPI Color Scale')
 */
export function ColorLegendPanel({ min, max, label, idSuffix }: ColorLegendProps) {
  const gradientId = `legend-gradient-${COLORS.kpiStart.replace('#','')}-${COLORS.kpiEnd.replace('#','')}${idSuffix ? '-' + idSuffix : ''}`;
  return (
    <div style={{ margin: '0 0 18px 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gridArea: '14 / 1 / 14 / 13' }}>
      <div style={{ fontSize: 13, color: COLORS.text, marginBottom: 4, textAlign: 'center' }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width="240" height="18" style={{ display: 'block', margin: '0 auto' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLORS.kpiStart} />
              <stop offset="100%" stopColor={COLORS.kpiEnd} />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="240" height="14" rx="7" fill={`url(#${gradientId})`} />
        </svg>
        <div style={{ width: 240, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLORS.text, marginTop: 2 }}>
          <span>{min.toFixed(2)}</span>
          <span>{max.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
