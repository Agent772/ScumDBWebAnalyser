import React, { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { COLORS } from './colors';
import { useTranslation } from 'react-i18next';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
}


export const Tooltip: React.FC<TooltipProps> = ({ content, children, placement = 'top', offset = 8 }) => {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const showTooltip = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0, left = 0;
      switch (placement) {
        case 'top':
          top = rect.top - offset;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - offset;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + offset;
          break;
        default:
          top = rect.top - offset;
          left = rect.left + rect.width / 2;
      }
      setCoords({ top, left });
    }
    setVisible(true);
  };

  const hideTooltip = () => setVisible(false);

  return (
    <div
      ref={triggerRef}
      style={{ display: 'inline-block', position: 'relative' }}
      onMouseEnter={showTooltip}
      onFocus={showTooltip}
      onMouseLeave={hideTooltip}
      onBlur={hideTooltip}
      tabIndex={0}
      aria-describedby={visible ? 'tooltip-content' : undefined}
    >
      {children}
      {visible && (
        <div
          id="tooltip-content"
          role="tooltip"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -100%)',
            background: COLORS.elevation5,
            color: COLORS.text,
            padding: '8px 12px',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            zIndex: 9999,
            pointerEvents: 'none',
            fontSize: 14,
            maxWidth: 320,
            minWidth: 80,
            textAlign: 'center',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
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


interface StatsTooltipProps {
  active?: boolean;
  name: string;
  kpi: number;
  kpiLabel: string;
  colorKPI?: number;
  coloringLabel?: string;
}

// Custom tooltip for detailed info
export function StatsTooltip({ active, name, kpi, kpiLabel, colorKPI, coloringLabel }: StatsTooltipProps) {
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
