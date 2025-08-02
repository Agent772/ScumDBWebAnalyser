/**
 * Represents a single entry in a chart, containing a name, KPI value, and optional color coding.
 *
 * @property name - The display name of the chart entry.
 * @property kpi - The key performance indicator value for this entry.
 * @property colorCodingKpi - (Optional) A value used for color coding this entry in the chart.
 */
 
/**
 * Represents the data structure for a chart, including its entries and optional color coding range.
 *
 * @property entries - An array of chart entries.
 * @property colorCodingMin - (Optional) The minimum value for color coding across all entries.
 * @property colorCodingMax - (Optional) The maximum value for color coding across all entries.
 */
// src/utils/types/ChartData.ts

export interface ChartEntry {
  name: string;
  kpi: number;
  colorCodingKpi?: number;
}

export interface ChartData {
  entries: ChartEntry[];
  colorCodingMin?: number;
  colorCodingMax?: number;
}