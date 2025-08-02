/**
 * A reusable KPI (Key Performance Indicator) component for displaying a header, value, and optional footer.
 *
 * @param header - The main label or title for the KPI.
 * @param value - The primary value or metric to display. Can be any React node.
 * @param footer - Optional. Additional information or context displayed below the value.
 * @param color - Optional. The color used for the text elements. Defaults to `#fff`.
 * @param style - Optional. Additional CSS properties to apply to the root container.
 *
 * @returns A styled box displaying the KPI header, value, and optional footer.
 */
import React from 'react';
import { COLORS } from './colors';

interface KPIProps {
  header: string;
  value: React.ReactNode;
  footer?: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}

export function KPI({ header, value, footer, color = COLORS.text, style }: KPIProps) {
  return (
    <section
      className="kpi-box"
      aria-label={header + ' KPI'}
      style={{
        background: COLORS.elevation2,
        borderRadius: 8,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: COLORS.shadow,
        flex: 1,
        ...style,
      }}
    >
      <h3
        style={{
          fontSize: 'clamp(1.1em, 2.5vw, 2.2em)',
          fontWeight: 600,
          color,
          opacity: 0.7,
          marginBottom: 2,
          lineHeight: 1,
          fontSizeAdjust: '0.67',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 'clamp(1.5em, 3vw, 2.8em)' }}>{header}</span>
      </h3>
      <div
        style={{
          fontSize: 'clamp(2.2em, 6vw, 4.5em)',
          fontWeight: 700,
          color,
          lineHeight: 1.1,
          margin: '0.1em 0 0.1em 0',
          textAlign: 'center',
        }}
      >
        {value}
      </div>
      {footer && (
        <div
          style={{
            fontSize: 'clamp(1em, 1.5vw, 1.5em)',
            color,
            opacity: 0.6,
            marginTop: 2,
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {footer}
        </div>
      )}
    </section>
  );
}
