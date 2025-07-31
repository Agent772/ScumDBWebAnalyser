import { Database } from 'sql.js';
import type { ChartEntry } from '../../utils/types/ChartData';

// Internal structure to hold all fishing stats in memory after one DB query

interface AllFishingStats {
  Caught: ChartEntry[];
  Heaviest: ChartEntry[];
  Longest: ChartEntry[];
  LinesBroken: ChartEntry[];
}


export function fetchAllFishingStats(db: Database): AllFishingStats {
  // Single query to get all relevant fields for all users
  const res = db.exec(`
    SELECT up.name,
           fs.fish_caught,
           ROUND(fs.heaviest_fish_caught,2) as heaviest_fish_caught,
           ROUND(fs.longest_fish_caught,2) as longest_fish_caught,
           fs.lines_broken
    FROM fishing_stats fs
    JOIN user_profile up ON fs.user_profile_id = up.id
  `);
  if (!res[0]) {
    return {
      Caught: [],
      Heaviest: [],
      Longest: [],
      LinesBroken: [],
    };
  }
  const rows = res[0].values;

  // Build ChartEntry arrays for each chart type
  const Caught: ChartEntry[] = rows
    .filter(row => row[1] !== null)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .map(row => ({
      name: row[0] as string,
      kpi: row[1] as number,
    }));

  const Heaviest: ChartEntry[] = rows
    .filter(row => row[2] !== null)
    .sort((a, b) => (b[2] as number) - (a[2] as number))
    .map(row => ({
      name: row[0] as string,
      kpi: row[2] as number,
      colorCodingKpi: row[1] as number, // color by total fish caught
    }));

  const Longest: ChartEntry[] = rows
    .filter(row => row[3] !== null)
    .sort((a, b) => (b[3] as number) - (a[3] as number))
    .map(row => ({
      name: row[0] as string,
      kpi: row[3] as number,
      colorCodingKpi: row[1] as number, // color by total fish caught
    }));

  const LinesBroken: ChartEntry[] = rows
    .filter(row => row[4] !== null)
    .sort((a, b) => (b[4] as number) - (a[4] as number))
    .map(row => ({
      name: row[0] as string,
      kpi: row[4] as number,
      colorCodingKpi: row[1] as number, // color by total fish caught
    }));

  return {
    Caught,
    Heaviest,
    Longest,
    LinesBroken,
  };
}
