import { COLORS } from '../ui/helpers/colors';
// Color interpolation utility for KPI-based bar coloring
// Usage: getKpiBarColor(value, min, max, colorStart, colorEnd)
// Example: getKpiBarColor(playtime, minPlaytime, maxPlaytime, COLORS.kpiStart, COLORS.kpiEnd)

/**
 * Interpolates between two hex colors based on t in [0,1].
 * @param color1 Hex color string (e.g. '#8ecae6')
 * @param color2 Hex color string (e.g. '#f7b801')
 * @param t Number between 0 and 1
 * @returns Interpolated rgb() string
 */
export function interpolateColor(color1: string, color2: string, t: number): string {
  const hexToRgb = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
  return `rgb(${r},${g},${b})`;
}

/**
 * Returns a color for a KPI value based on its position between min and max.
 * @param value The KPI value (e.g. playtime, fish caught)
 * @param min The minimum value in the dataset
 * @param max The maximum value in the dataset
 * @param colorStart The color for the minimum (default: '#8ecae6')
 * @param colorEnd The color for the maximum (default: '#f7b801')
 * @returns Interpolated rgb() string
 */
export function getKpiBarColor(
  value: number,
  min: number,
  max: number
): string {
  if (max === min) return COLORS.kpiStart;
  const t = (value - min) / (max - min);
  return interpolateColor(COLORS.kpiStart, COLORS.kpiEnd, t);
}
