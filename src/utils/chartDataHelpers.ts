/**
 * Converts an array of `ChartEntry` objects into a `ChartData` object suitable for chart rendering.
 * 
 * - Sorts the entries in descending order by their `kpi` value.
 * - Selects the top N entries (default is 10).
 * - Rounds each entry's `kpi` value to two decimal places.
 * - Determines the minimum and maximum values of `colorCodingKpi` among the selected entries.
 * 
 * @param entries - The array of `ChartEntry` objects to process.
 * @param topN - The number of top entries to include (default: 10).
 * @returns A `ChartData` object containing the processed entries and color coding min/max values.
 */
/**
 * Rounds a number to two decimal places.
 *
 * @param n - The number to round.
 * @returns The number rounded to two decimal places.
 */
import type { ChartEntry, ChartData } from './types/ChartData';

export function toChartData(entries: ChartEntry[], topN = 10): ChartData {
  const sorted = entries.slice().sort((a, b) => b.kpi - a.kpi).slice(0, topN).map(e => ({
    ...e,
    kpi: round2(e.kpi),
  }));
  // Compute colorCoding min/max over all entries, not just the top N
  const colorCodingKpisAll = entries.map(e => e.colorCodingKpi).filter((v): v is number => v !== undefined);
  return {
    entries: sorted,
    colorCodingMin: colorCodingKpisAll.length ? Math.min(...colorCodingKpisAll) : undefined,
    colorCodingMax: colorCodingKpisAll.length ? Math.max(...colorCodingKpisAll) : undefined,
  };
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

