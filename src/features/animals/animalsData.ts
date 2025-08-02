import { Database } from 'sql.js';
import type { ChartEntry } from '../../utils/types/ChartData';

// Internal structure to hold all kills stats in memory after one DB query
interface AllAnimalsStats {
  MostAnimalsKilled: ChartEntry[];
  MostAnimalsSkinned: ChartEntry[];
  MostCrowsKilled: ChartEntry[];
  MostSeagullsKilled: ChartEntry[];
  MostHorsesKilled: ChartEntry[];
  MostBoarsKilled: ChartEntry[];
  MostGoatsKilled: ChartEntry[];
  MostDeersKilled: ChartEntry[];
  MostChickensKilled: ChartEntry[];
  MostRabbitsKilled: ChartEntry[];
  MostDonkeysKilled: ChartEntry[];
  MostTimesMauledByBear: ChartEntry[];
  MostLongestAnimalKillDistance: ChartEntry[];
  MostWolvesKilled: ChartEntry[];
  PlayTimes: number[];
}

export function fetchAllAnimalsStats(db: Database): AllAnimalsStats {
  const res = db.exec(`
    SELECT up.name, up.play_time / 60 AS play_time, 
      s.animals_killed, 
      s.animals_skinned,
      s.crows_killed,
      s.seagulls_killed,
      s.horses_killed,
      s.boars_killed,
      s.goats_killed,
      s.deers_killed,
      s.chickens_killed,
      s.rabbits_killed,
      s.donkeys_killed,
      s.times_mauled_by_bear,
      s.longest_animal_kill_distance,
      s.wolves_killed
    FROM user_profile up
    JOIN survival_stats s ON up.id = s.user_profile_id
  `);

  if (!res || res.length === 0) {
    return {
      MostAnimalsKilled: [],
      MostAnimalsSkinned: [],
      MostCrowsKilled: [],
      MostSeagullsKilled: [],
      MostHorsesKilled: [],
      MostBoarsKilled: [],
      MostGoatsKilled: [],
      MostDeersKilled: [],
      MostChickensKilled: [],
      MostRabbitsKilled: [],
      MostDonkeysKilled: [],
      MostTimesMauledByBear: [],
      MostLongestAnimalKillDistance: [],
      MostWolvesKilled: [],
      PlayTimes: [],
    };
  }

  const { columns, values } = res[0];

  const MostAnimalsKilled: ChartEntry[] = [];
  const MostAnimalsSkinned: ChartEntry[] = [];
  const MostCrowsKilled: ChartEntry[] = [];
  const MostSeagullsKilled: ChartEntry[] = [];
  const MostHorsesKilled: ChartEntry[] = [];
  const MostBoarsKilled: ChartEntry[] = [];
  const MostGoatsKilled: ChartEntry[] = [];
  const MostDeersKilled: ChartEntry[] = [];
  const MostChickensKilled: ChartEntry[] = [];
  const MostRabbitsKilled: ChartEntry[] = [];
  const MostDonkeysKilled: ChartEntry[] = [];
  const MostTimesMauledByBear: ChartEntry[] = [];
  const MostLongestAnimalKillDistance: ChartEntry[] = [];
  const MostWolvesKilled: ChartEntry[] = [];
  const PlayTimes: number[] = [];

  for (const row of values) {
    const name = row[columns.indexOf('name')] as string;
    const playTime = row[columns.indexOf('play_time')] as number;
    const animalsKilled = row[columns.indexOf('animals_killed')] as number;
    const animalsSkinned = row[columns.indexOf('animals_skinned')] as number;
    const crowsKilled = row[columns.indexOf('crows_killed')] as number;
    const seagullsKilled = row[columns.indexOf('seagulls_killed')] as number;
    const horsesKilled = row[columns.indexOf('horses_killed')] as number;
    const boarsKilled = row[columns.indexOf('boars_killed')] as number;
    const goatsKilled = row[columns.indexOf('goats_killed')] as number;
    const deersKilled = row[columns.indexOf('deers_killed')] as number;
    const chickensKilled = row[columns.indexOf('chickens_killed')] as number;
    const rabbitsKilled = row[columns.indexOf('rabbits_killed')] as number;
    const donkeysKilled = row[columns.indexOf('donkeys_killed')] as number;
    const timesMauledByBear = row[columns.indexOf('times_mauled_by_bear')] as number;
    const longestAnimalKillDistance = row[columns.indexOf('longest_animal_kill_distance')] as number;
    const wolvesKilled = row[columns.indexOf('wolves_killed')] as number;

    MostAnimalsKilled.push({ name, kpi: animalsKilled, colorCodingKpi: playTime });
    MostAnimalsSkinned.push({ name, kpi: animalsSkinned, colorCodingKpi: playTime });
    MostCrowsKilled.push({ name, kpi: crowsKilled, colorCodingKpi: playTime });
    MostSeagullsKilled.push({ name, kpi: seagullsKilled, colorCodingKpi: playTime });
    MostHorsesKilled.push({ name, kpi: horsesKilled, colorCodingKpi: playTime });
    MostBoarsKilled.push({ name, kpi: boarsKilled, colorCodingKpi: playTime });
    MostGoatsKilled.push({ name, kpi: goatsKilled, colorCodingKpi: playTime });
    MostDeersKilled.push({ name, kpi: deersKilled, colorCodingKpi: playTime });
    MostChickensKilled.push({ name, kpi: chickensKilled, colorCodingKpi: playTime });
    MostRabbitsKilled.push({ name, kpi: rabbitsKilled, colorCodingKpi: playTime });
    MostDonkeysKilled.push({ name, kpi: donkeysKilled, colorCodingKpi: playTime });
    MostTimesMauledByBear.push({ name, kpi: timesMauledByBear, colorCodingKpi: playTime });
    MostLongestAnimalKillDistance.push({ name, kpi: longestAnimalKillDistance, colorCodingKpi: playTime });
    MostWolvesKilled.push({ name, kpi: wolvesKilled, colorCodingKpi: playTime });
    PlayTimes.push(playTime);
  }

  return {
    MostAnimalsKilled,
    MostAnimalsSkinned,
    MostCrowsKilled,
    MostSeagullsKilled,
    MostHorsesKilled,
    MostBoarsKilled,
    MostGoatsKilled,
    MostDeersKilled,
    MostChickensKilled,
    MostRabbitsKilled,
    MostDonkeysKilled,
    MostTimesMauledByBear,
    MostLongestAnimalKillDistance,
    MostWolvesKilled,
    PlayTimes
  };
}
