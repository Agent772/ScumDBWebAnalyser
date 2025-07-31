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