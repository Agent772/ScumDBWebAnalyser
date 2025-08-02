/**
 * Custom tooltip component for displaying detailed KPI information.
 *
 * @param props - The properties for the tooltip component.
 * @param props.active - Whether the tooltip is visible.
 * @param props.name - The name to display in the tooltip.
 * @param props.kpi - The KPI value to display.
 * @param props.kpiLabel - The label for the KPI value.
 * @param props.colorKPI - (Optional) An additional KPI value for coloring.
 * @param props.coloringLabel - (Optional) The label for the coloring KPI value.
 * @returns A styled tooltip element with the provided information, or null if not active.
 */
import { COLORS } from './colors';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  if (active) {
    return (
      <div
        role="tooltip"
        aria-live="polite"
        style={{ background: COLORS.elevation5, color: COLORS.text, borderRadius: 6, padding: '10px 14px', boxShadow: `0 2px 8px ${COLORS.elevation5}`, fontSize: 13, lineHeight: 1.5 }}
      >
        <dl style={{ margin: 0 }}>
          <dt><strong>{t('player_name')}:</strong></dt>
          <dd style={{ margin: 0 }}>{name}</dd>
          <dt><strong>{kpiLabel}:</strong></dt>
          <dd style={{ margin: 0 }}>{kpi.toFixed(2)}</dd>
          {coloringLabel && colorKPI !== undefined && (
            <>
              <dt><strong>{coloringLabel}:</strong></dt>
              <dd style={{ margin: 0 }}>{colorKPI.toFixed(2)}</dd>
            </>
          )}
        </dl>
      </div>
    );
  }
  return null;
}
