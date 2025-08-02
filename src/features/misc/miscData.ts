import { Database } from 'sql.js';
import type { ChartEntry } from '../../utils/types/ChartData';

// Internal structure to hold all looting stats in memory after one DB query

interface AllMISCStats {
  FoliageCut: ChartEntry[];
  HeartAttacks: ChartEntry[];
  Overdose: ChartEntry[];
  HighestMuscleMass: ChartEntry[];
  HighestFat: ChartEntry[];
  PlayTimes: number[];
}

export function fetchAllMISCStats(db: Database): AllMISCStats {
  const res = db.exec(`
    SELECT up.name, up.play_time / 60 AS play_time,
      s.foliage_cut,
      s.heart_attacks,
      s.overdose,
      s.highest_muscle_mass,
      s.highest_fat
    FROM user_profile up
    JOIN survival_stats s ON up.id = s.user_profile_id
  `);

  if (!res || res.length === 0) {
    return {
      FoliageCut: [],
      HeartAttacks: [],
      Overdose: [],
      HighestMuscleMass: [],
      HighestFat: [],
      PlayTimes: [],
    };
  }

  const { columns, values } = res[0];

  const FoliageCut: ChartEntry[] = [];
  const HeartAttacks: ChartEntry[] = [];
  const Overdose: ChartEntry[] = [];
  const HighestMuscleMass: ChartEntry[] = [];
  const HighestFat: ChartEntry[] = [];
  const PlayTimes: number[] = [];

  for (const row of values) {
    const name = row[columns.indexOf('name')] as string;
    const playTime = row[columns.indexOf('play_time')] as number;
    const foliageCut = row[columns.indexOf('foliage_cut')] as number;
    const heartAttacks = row[columns.indexOf('heart_attacks')] as number;
    const overdose = row[columns.indexOf('overdose')] as number;
    const highestMuscleMass = row[columns.indexOf('highest_muscle_mass')] as number;
    const highestFat = row[columns.indexOf('highest_fat')] as number;

    FoliageCut.push({ name, kpi: foliageCut, colorCodingKpi: playTime });
    HeartAttacks.push({ name, kpi: heartAttacks, colorCodingKpi: playTime });
    Overdose.push({ name, kpi: overdose, colorCodingKpi: playTime });
    HighestMuscleMass.push({ name, kpi: highestMuscleMass, colorCodingKpi: playTime });
    HighestFat.push({ name, kpi: highestFat, colorCodingKpi: playTime });
    PlayTimes.push(playTime);
  }

  return {
    FoliageCut,
    HeartAttacks,
    Overdose,
    HighestMuscleMass,
    HighestFat,
    PlayTimes
  };
}