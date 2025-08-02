/**
 * Computes and returns demographic analytics from the provided SQL.js database.
 *
 * This function aggregates various statistics about player demographics, including:
 * - Total player count
 * - Average play time (in minutes)
 * - Gender distribution (counts of Male, Female, and Unknown)
 * - Penis size statistics (average, minimum, maximum)
 * - Breast size statistics (average, minimum, maximum)
 * - Age distribution (counts per age)
 *
 * @param db - The SQL.js `Database` instance to query demographic data from.
 * @returns An object containing demographic analytics.
 */
import { Database } from 'sql.js';

export interface DemographicsAnalytics {
  playerCount: number;
  avgPlayTimeMinutes: number;
  genderCounts: Record<'Male' | 'Female' | 'Unknown', number>;
  avgPenisSize: number | null;
  minPenisSize: number | null;
  maxPenisSize: number | null;
  avgBreastSize: number | null;
  minBreastSize: number | null;
  maxBreastSize: number | null;
  ageDistribution: { age: number; count: number }[];
}

function mapGender(gender: number): 'Male' | 'Female' | 'Unknown' {
  if (gender === 1) return 'Female';
  if (gender === 2) return 'Male';
  return 'Unknown';
}

export function getDemographicsAnalytics(db: Database): DemographicsAnalytics {
  // Player count and avg play time
  const kpiRes = db.exec(`SELECT COUNT(id) as playerCount, AVG(play_time) as avgPlayTime FROM user_profile`);
  const kpiRow = kpiRes[0]?.values[0] || [0, 0];
  const playerCount = kpiRow[0] as number;
  const avgPlayTimeMinutes = kpiRow[1] ? Math.round((kpiRow[1] as number) / 60) : 0;

  // Gender distribution
  const genderRes = db.exec(`SELECT p.gender, COUNT(*) as count FROM user_profile up LEFT JOIN prisoner p ON up.prisoner_id = p.id GROUP BY p.gender`);
  const genderCounts: Record<'Male' | 'Female' | 'Unknown', number> = { Male: 0, Female: 0, Unknown: 0 };
  if (genderRes[0]) {
    for (const row of genderRes[0].values) {
      const gender = mapGender(row[0] as number);
      genderCounts[gender] += row[1] as number;
    }
  }

  // Penis size stats
  const penisRes = db.exec(`SELECT AVG(penis_size), MIN(penis_size), MAX(penis_size) FROM prisoner WHERE penis_size IS NOT NULL`);
  const [avgPenisSize, minPenisSize, maxPenisSize] = penisRes[0]?.values[0] || [null, null, null];

  // Breast size stats
  const breastRes = db.exec(`SELECT AVG(breast_size), MIN(breast_size), MAX(breast_size) FROM prisoner WHERE breast_size IS NOT NULL`);
  const [avgBreastSize, minBreastSize, maxBreastSize] = breastRes[0]?.values[0] || [null, null, null];

  // Age distribution
  const ageRes = db.exec(`SELECT age, COUNT(*) as count FROM prisoner WHERE age IS NOT NULL GROUP BY age ORDER BY age`);
  const ageDistribution = ageRes[0]?.values.map(row => ({ age: row[0] as number, count: row[1] as number })) || [];

  return {
    playerCount,
    avgPlayTimeMinutes,
    genderCounts,
    avgPenisSize: avgPenisSize !== null ? Number(avgPenisSize) : null,
    minPenisSize: minPenisSize !== null ? Number(minPenisSize) : null,
    maxPenisSize: maxPenisSize !== null ? Number(maxPenisSize) : null,
    avgBreastSize: avgBreastSize !== null ? Number(avgBreastSize) : null,
    minBreastSize: minBreastSize !== null ? Number(minBreastSize) : null,
    maxBreastSize: maxBreastSize !== null ? Number(maxBreastSize) : null,
    ageDistribution,
  };
}
