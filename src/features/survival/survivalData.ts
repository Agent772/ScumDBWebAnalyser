import { Database } from 'sql.js';
import type { ChartEntry } from '../../utils/types/ChartData';

// Internal structure to hold all survival stats in memory after one DB query
interface AllSurvivalStats {
  FP: ChartEntry[];
  highestFP: ChartEntry[];
  lowestFP: ChartEntry[];
  survivedTime: ChartEntry[];
  timeDead: ChartEntry[];
  woundsPatched: ChartEntry[];
  teethLost: ChartEntry[];
  highestDamageTaken: ChartEntry[];
  timesMauledByBear: ChartEntry[];
  timesCaughtByShark: ChartEntry[];
  timesEscapedSharkBite: ChartEntry[];
  playTimes: number[];
}

export function fetchAllSurvivalStats(db: Database): AllSurvivalStats {
  const res = db.exec(`
    SELECT up.name, 
      up.fame_points, 
      up.play_time / 60 AS play_time, 
      s.highest_positive_fame_points,
      s.lowest_negative_fame_points, 
      s.minutes_survived,
      s.wounds_patched,
      s.teeth_lost,
      s.highest_damage_taken,
      s.times_mauled_by_bear,
      s.times_caught_by_shark,
      s.times_escaped_shark_bite
    FROM user_profile up
    JOIN survival_stats s ON up.id = s.user_profile_id
  `);

  if (!res || res.length === 0) {
    return {
      FP: [],
      highestFP: [],
      lowestFP: [],
      survivedTime: [],
      timeDead: [],
      woundsPatched: [],
      teethLost: [],
      highestDamageTaken: [],
      timesMauledByBear: [],
      timesCaughtByShark: [],
      timesEscapedSharkBite: [],
      playTimes: [],
    };
  }

  const { columns, values } = res[0];

  const FP: ChartEntry[] = [];
  const highestFP: ChartEntry[] = [];
  const lowestFP: ChartEntry[] = [];
  const survivedTime: ChartEntry[] = [];
  const timeDead: ChartEntry[] = [];
  const woundsPatched: ChartEntry[] = [];
  const teethLost: ChartEntry[] = [];
  const highestDamageTaken: ChartEntry[] = [];
  const timesMauledByBear: ChartEntry[] = [];
  const timesCaughtByShark: ChartEntry[] = [];
  const timesEscapedSharkBite: ChartEntry[] = [];
  const playTimes: number[] = [];

  for (const row of values) {
    const name = row[columns.indexOf('name')] as string;
    const famePoints = row[columns.indexOf('fame_points')] as number;
    const playTime = row[columns.indexOf('play_time')] as number;
    const highestPositiveFP = row[columns.indexOf('highest_positive_fame_points')] as number;
    const lowestNegativeFP = row[columns.indexOf('lowest_negative_fame_points')] as number;
    const minutesSurvived = row[columns.indexOf('minutes_survived')] as number;
    const woundsPatchedVal = row[columns.indexOf('wounds_patched')] as number;
    const teethLostVal = row[columns.indexOf('teeth_lost')] as number;
    const highestDamageTakenVal = row[columns.indexOf('highest_damage_taken')] as number;
    const timesMauledByBearVal = row[columns.indexOf('times_mauled_by_bear')] as number;
    const timesCaughtBySharkVal = row[columns.indexOf('times_caught_by_shark')] as number;
    const timesEscapedSharkBiteVal = row[columns.indexOf('times_escaped_shark_bite')] as number;
    const minutesDead = playTime - minutesSurvived;

    FP.push({ name, kpi: famePoints, colorCodingKpi: playTime });
    highestFP.push({ name, kpi: highestPositiveFP, colorCodingKpi: playTime });
    lowestFP.push({ name, kpi: lowestNegativeFP, colorCodingKpi: playTime });
    survivedTime.push({ name, kpi: minutesSurvived, colorCodingKpi: playTime });
    timeDead.push({ name, kpi: minutesDead, colorCodingKpi: playTime });
    woundsPatched.push({ name, kpi: woundsPatchedVal, colorCodingKpi: playTime });
    teethLost.push({ name, kpi: teethLostVal, colorCodingKpi: playTime });
    highestDamageTaken.push({ name, kpi: highestDamageTakenVal, colorCodingKpi: playTime });
    timesMauledByBear.push({ name, kpi: timesMauledByBearVal, colorCodingKpi: playTime });
    timesCaughtByShark.push({ name, kpi: timesCaughtBySharkVal, colorCodingKpi: playTime });
    timesEscapedSharkBite.push({ name, kpi: timesEscapedSharkBiteVal, colorCodingKpi: playTime });
    playTimes.push(playTime);
  }

  return {
    FP,
    highestFP,
    lowestFP,
    survivedTime,
    timeDead,
    woundsPatched,
    teethLost,
    highestDamageTaken,
    timesMauledByBear,
    timesCaughtByShark,
    timesEscapedSharkBite,
    playTimes,
  };
}
