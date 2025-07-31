/**
 * Styles and helpers for chart components.
 *
 * @module chartHelpers
 */

 /**
  * CSS properties for the chart container.
  * Applies layout, sizing, and background color.
  */
 
 /**
  * CSS properties for the chart header.
  * Sets font weight and margin.
  */
 
 /**
  * Style object for the Y axis of the chart.
  * Sets font size and text color.
  */
 
 /**
  * Style object for the X axis of the chart.
  * Sets font size and text color.
  */
 
/**
 * Calculates a dynamic maximum value for the X axis based on the provided array and key.
 * Ensures the maximum is at least 1 and adds a 10% buffer to the highest value.
 *
 * @typeParam T - The type of objects in the array.
 * @typeParam Key - The key of the numeric property to evaluate.
 * @param arr - The array of objects to evaluate.
 * @param key - The key of the numeric property to use for maximum calculation.
 * @returns The calculated maximum value for the X axis.
 */
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

export const xAxisStyle: Partial<React.SVGProps<SVGTextElement>> = {
  fontSize: 12,
  fill: COLORS.text,
};

// Helper for dynamic X axis max (type-safe)
export function getXAxisMax<T extends { [K in Key]?: number }, Key extends keyof T>(arr: T[], key: Key) {
  const max = arr.length > 0 ? Math.max(...arr.map(a => a[key] ?? 0)) : 0;
  return max > 0 ? Math.ceil(max * 1.1) : 1;
}