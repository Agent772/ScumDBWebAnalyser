// src/ui/chartStyles.ts
import { COLORS } from './colors';

export const chartContainerStyle: React.CSSProperties = {
  borderRadius: 6,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'stretch',
  alignItems: 'stretch',
  minWidth: 0,
  minHeight: 220,
  height: '100%',
  width: '100%',
  background: COLORS.elevation2,
};

export const chartHeaderStyle: React.CSSProperties = {
  fontWeight: 600,
  margin: '12px 16px 8px 16px',
};

export const yAxisStyle = {
  fontSize: 12,
  fill: COLORS.text,
};

export const xAxisStyle = {
  fontSize: 12,
  fill: COLORS.text,
};

// Helper for dynamic X axis max (type-safe)
export function getXAxisMax<T extends { [K in Key]?: number }, Key extends keyof T>(arr: T[], key: Key) {
  const max = arr.length > 0 ? Math.max(...arr.map(a => a[key] ?? 0)) : 0;
  return max > 0 ? Math.ceil(max * 1.1) : 1;
}