/**
 * Fetches all crafting statistics from the provided SQLite database and returns them
 * in a structured format suitable for charting and analysis.
 *
 * The function queries the `user_profile` and `survival_stats` tables to retrieve
 * each user's name, play time (in minutes), and various crafting statistics.
 * The results are mapped into arrays of `ChartEntry` objects for each crafting category,
 * as well as an array of play times.
 *
 * @param db - The SQLite database instance to query.
 * @returns An object containing arrays of crafting statistics and play times:
 * - `MostGunsCrafted`: Array of users and their guns crafted count.
 * - `MostBulletsCrafted`: Array of users and their bullets crafted count.
 * - `MostArrowsCrafted`: Array of users and their arrows crafted count.
 * - `MostClothingCrafted`: Array of users and their clothing crafted count.
 * - `MostMeleeWeaponsCrafted`: Array of users and their melee weapons crafted count.
 * - `PlayTimes`: Array of user play times (in minutes).
 */
import { Database } from 'sql.js';
import type { ChartEntry } from '../../utils/types/ChartData';

// Internal structure to hold all crafting stats in memory after one DB query
interface AllCraftingStats {
  MostGunsCrafted: ChartEntry[];
  MostBulletsCrafted: ChartEntry[];
  MostArrowsCrafted: ChartEntry[];
  MostClothingCrafted: ChartEntry[];
  MostMeleeWeaponsCrafted: ChartEntry[];
  PlayTimes: number[];
}

export function fetchAllCraftingStats(db: Database): AllCraftingStats {
  const res = db.exec(`
    SELECT up.name, up.play_time / 60 AS play_time, 
      s.guns_crafted, 
      s.bullets_crafted,
      s.arrows_crafted,
      s.clothing_crafted,
      s.melee_weapons_crafted
    FROM user_profile up
    JOIN survival_stats s ON up.id = s.user_profile_id
  `);

  if (!res || res.length === 0) {
    return {
      MostGunsCrafted: [],
      MostBulletsCrafted: [],
      MostArrowsCrafted: [],
      MostClothingCrafted: [],
      MostMeleeWeaponsCrafted: [],
      PlayTimes: [],
    };
  }

  const { columns, values } = res[0];

  const MostGunsCrafted: ChartEntry[] = [];
  const MostBulletsCrafted: ChartEntry[] = [];
  const MostArrowsCrafted: ChartEntry[] = [];
  const MostClothingCrafted: ChartEntry[] = [];
  const MostMeleeWeaponsCrafted: ChartEntry[] = [];
  const PlayTimes: number[] = [];

  for (const row of values) {
    const name = row[columns.indexOf('name')] as string;
    const playTime = row[columns.indexOf('play_time')] as number;
    const gunsCrafted = row[columns.indexOf('guns_crafted')] as number;
    const bulletsCrafted = row[columns.indexOf('bullets_crafted')] as number;
    const arrowsCrafted = row[columns.indexOf('arrows_crafted')] as number;
    const clothingCrafted = row[columns.indexOf('clothing_crafted')] as number;
    const meleeWeaponsCrafted = row[columns.indexOf('melee_weapons_crafted')] as number;

    MostGunsCrafted.push({ name, kpi: gunsCrafted, colorCodingKpi: playTime });
    MostBulletsCrafted.push({ name, kpi: bulletsCrafted, colorCodingKpi: playTime });
    MostArrowsCrafted.push({ name, kpi: arrowsCrafted, colorCodingKpi: playTime });
    MostClothingCrafted.push({ name, kpi: clothingCrafted, colorCodingKpi: playTime });
    MostMeleeWeaponsCrafted.push({ name, kpi: meleeWeaponsCrafted, colorCodingKpi: playTime });
    PlayTimes.push(playTime);
  }

  return {
    MostGunsCrafted,
    MostBulletsCrafted,
    MostArrowsCrafted,
    MostClothingCrafted,
    MostMeleeWeaponsCrafted,
    PlayTimes
  };
}
