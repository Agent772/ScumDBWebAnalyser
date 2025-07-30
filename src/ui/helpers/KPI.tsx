import React from 'react';
import { COLORS } from './colors';

interface KPIProps {
  header: string;
  value: React.ReactNode;
  footer?: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}

export function KPI({ header, value, footer, color = '#fff', style }: KPIProps) {
  return (
    <div
      className="kpi-box"
      style={{
        background: COLORS.elevation2,
        borderRadius: 8,
        //padding: '0.3em 0.5em',
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
      <div
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
      </div>
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
    </div>
  );
}
