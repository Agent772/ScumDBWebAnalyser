/**
 * Fetches and aggregates all kill-related statistics from the database for each user profile.
 *
 * This function performs a single query joining the `user_profile` and `survival_stats` tables,
 * then processes the results into various arrays of `ChartEntry` objects, each representing a different
 * statistic (e.g., most kills, most deaths, highest accuracy, etc.). Each entry includes the player's name,
 * the KPI value for the statistic, and a color-coding KPI (typically play time or a related metric).
 *
 * Additionally, it computes derived statistics such as kill/death ratios and accuracy.
 *
 * @param db - The SQL.js `Database` instance to query.
 * @returns An object containing arrays of `ChartEntry` for each statistic and an array of play times.
 */
import { Database } from 'sql.js';
import type { ChartEntry } from '../../utils/types/ChartData';

// Internal structure to hold all kills stats in memory after one DB query
interface AllkillsStats {
  MostAnimalsKilled: ChartEntry[];
  MostKills: ChartEntry[];
  MostDeaths: ChartEntry[];
  MostPuppetsKilled: ChartEntry[];
  MostLongestKillDistance: ChartEntry[];
  MostMeleeKills: ChartEntry[];
  MostArcheryKills: ChartEntry[];
  MostPlayersKnockedOut: ChartEntry[];
  MostShotsFired: ChartEntry[];
  MostShotsHit: ChartEntry[];
  MostHeadshots: ChartEntry[];
  MostMeleeWeaponSwings: ChartEntry[];
  MostMeleeWeaponHits: ChartEntry[];
  MostDroneKills: ChartEntry[];
  MostSentryKills: ChartEntry[];
  MostPrisonerKills: ChartEntry[];
  MostPuppetsKnockedOut: ChartEntry[];
  MostFirearmKills: ChartEntry[];
  MostBareHandedKills: ChartEntry[];
  MostDeathsByPrisoners: ChartEntry[];
  HighestAllKD: ChartEntry[];
  HighestPrisonerKD: ChartEntry[];
  HighestAccuracy: ChartEntry[];
  PlayTimes: number[];
}

export function fetchAllKillsStats(db: Database): AllkillsStats {
  const res = db.exec(`
    SELECT up.name, up.play_time / 60 AS play_time, 
      s.animals_killed, 
      s.kills,
      s.deaths,
      s.puppets_killed,
      s.longest_kill_distance,
      s.melee_kills,
      s.archery_kills,
      s.players_knocked_out,
      s.shots_fired,
      s.shots_hit,
      s.headshots,
      s.melee_weapon_swings,
      s.melee_weapon_hits,
      s.drone_kills,
      s.sentry_kills,
      s.prisoner_kills,
      s.puppets_knocked_out,
      s.firearm_kills,
      s.bare_handed_kills,
      s.deaths_by_prisoners
    FROM user_profile up
    JOIN survival_stats s ON up.id = s.user_profile_id
  `);

  if (!res || res.length === 0) {
    return {
      MostAnimalsKilled: [],
      MostKills: [],
      MostDeaths: [],
      MostPuppetsKilled: [],
      MostLongestKillDistance: [],
      MostMeleeKills: [],
      MostArcheryKills: [],
      MostPlayersKnockedOut: [],
      MostShotsFired: [],
      MostShotsHit: [],
      MostHeadshots: [],
      MostMeleeWeaponSwings: [],
      MostMeleeWeaponHits: [],
      MostDroneKills: [],
      MostSentryKills: [],
      MostPrisonerKills: [],
      MostPuppetsKnockedOut: [],
      MostFirearmKills: [],
      MostBareHandedKills: [],
      MostDeathsByPrisoners: [],
      HighestAllKD: [],
      HighestPrisonerKD: [],
      HighestAccuracy: [],
      PlayTimes: [],
    };
  }

  const { columns, values } = res[0];

  const MostAnimalsKilled: ChartEntry[] = [];
  const MostKills: ChartEntry[] = [];
  const MostDeaths: ChartEntry[] = [];
  const MostPuppetsKilled: ChartEntry[] = [];
  const MostLongestKillDistance: ChartEntry[] = [];
  const MostMeleeKills: ChartEntry[] = [];
  const MostArcheryKills: ChartEntry[] = [];
  const MostPlayersKnockedOut: ChartEntry[] = [];
  const MostShotsFired: ChartEntry[] = [];
  const MostShotsHit: ChartEntry[] = [];
  const MostHeadshots: ChartEntry[] = [];
  const MostMeleeWeaponSwings: ChartEntry[] = [];
  const MostMeleeWeaponHits: ChartEntry[] = [];
  const MostDroneKills: ChartEntry[] = [];
  const MostSentryKills: ChartEntry[] = [];
  const MostPrisonerKills: ChartEntry[] = [];
  const MostPuppetsKnockedOut: ChartEntry[] = [];
  const MostFirearmKills: ChartEntry[] = [];
  const MostBareHandedKills: ChartEntry[] = [];
  const MostDeathsByPrisoners: ChartEntry[] = [];
  const HighestAllKD: ChartEntry[] = [];
  const HighestPrisonerKD: ChartEntry[] = [];
  const HighestAccuracy: ChartEntry[] = [];
  const PlayTimes: number[] = [];

  for (const row of values) {
    const name = row[columns.indexOf('name')] as string;
    const animalsKilled = row[columns.indexOf('animals_killed')] as number;
    const kills = row[columns.indexOf('kills')] as number;
    const deaths = row[columns.indexOf('deaths')] as number;
    const puppetsKilled = row[columns.indexOf('puppets_killed')] as number;
    const longestKillDistance = row[columns.indexOf('longest_kill_distance')] as number;
    const meleeKills = row[columns.indexOf('melee_kills')] as number;
    const archeryKills = row[columns.indexOf('archery_kills')] as number;
    const playersKnockedOut = row[columns.indexOf('players_knocked_out')] as number;
    const shotsFired = row[columns.indexOf('shots_fired')] as number;
    const shotsHit = row[columns.indexOf('shots_hit')] as number;
    const headshots = row[columns.indexOf('headshots')] as number;
    const meleeWeaponSwings = row[columns.indexOf('melee_weapon_swings')] as number;
    const meleeWeaponHits = row[columns.indexOf('melee_weapon_hits')] as number;
    const droneKills = row[columns.indexOf('drone_kills')] as number;
    const sentryKills = row[columns.indexOf('sentry_kills')] as number;
    const prisonerKills = row[columns.indexOf('prisoner_kills')] as number;
    const puppetsKnockedOut = row[columns.indexOf('puppets_knocked_out')] as number;
    const firearmKills = row[columns.indexOf('firearm_kills')] as number;
    const bareHandedKills = row[columns.indexOf('bare_handed_kills')] as number;
    const playTime = row[columns.indexOf('play_time')] as number;
    const deathsByPrisoners = row[columns.indexOf('deaths_by_prisoners')] as number;
    const kd = kills / (deaths > 0 ? deaths : 1) as number;
    const prisonerKd = prisonerKills / (deathsByPrisoners > 0 ? deathsByPrisoners : 1) as number;
    const accuracy = shotsHit / (shotsFired > 0 ? shotsFired : 1) as number;

    MostAnimalsKilled.push({ name, kpi: animalsKilled, colorCodingKpi: playTime });
    MostKills.push({ name, kpi: kills, colorCodingKpi: playTime });
    MostDeaths.push({ name, kpi: deaths, colorCodingKpi: playTime });
    MostPuppetsKilled.push({ name, kpi: puppetsKilled, colorCodingKpi: playTime });
    MostLongestKillDistance.push({ name, kpi: longestKillDistance, colorCodingKpi: playTime });
    MostMeleeKills.push({ name, kpi: meleeKills, colorCodingKpi: playTime });
    MostArcheryKills.push({ name, kpi: archeryKills, colorCodingKpi: playTime });
    MostPlayersKnockedOut.push({ name, kpi: playersKnockedOut, colorCodingKpi: playTime });
    MostShotsFired.push({ name, kpi: shotsFired, colorCodingKpi: playTime });
    MostShotsHit.push({ name, kpi: shotsHit, colorCodingKpi: shotsFired });
    MostHeadshots.push({ name, kpi: headshots, colorCodingKpi: shotsFired });
    MostMeleeWeaponSwings.push({ name, kpi: meleeWeaponSwings, colorCodingKpi: playTime });
    MostMeleeWeaponHits.push({ name, kpi: meleeWeaponHits, colorCodingKpi: meleeWeaponSwings });
    MostDroneKills.push({ name, kpi: droneKills, colorCodingKpi: playTime });
    MostSentryKills.push({ name, kpi: sentryKills, colorCodingKpi: playTime });
    MostPrisonerKills.push({ name, kpi: prisonerKills, colorCodingKpi: playTime });
    MostPuppetsKnockedOut.push({ name, kpi: puppetsKnockedOut, colorCodingKpi: playTime });
    MostFirearmKills.push({ name, kpi: firearmKills, colorCodingKpi: playTime });
    MostBareHandedKills.push({ name, kpi: bareHandedKills, colorCodingKpi: playTime });
    MostDeathsByPrisoners.push({ name, kpi: deathsByPrisoners, colorCodingKpi: playTime });
    HighestAllKD.push({ name, kpi: kd, colorCodingKpi: kills });
    HighestPrisonerKD.push({ name, kpi: prisonerKd, colorCodingKpi: prisonerKills });
    HighestAccuracy.push({ name, kpi: accuracy, colorCodingKpi: shotsFired });
    PlayTimes.push(playTime);
  }

  return {
    MostAnimalsKilled,
    MostKills,
    MostDeaths,
    MostPuppetsKilled,
    MostLongestKillDistance,
    MostMeleeKills,
    MostArcheryKills,
    MostPlayersKnockedOut,
    MostShotsFired,
    MostShotsHit,
    MostHeadshots,
    MostMeleeWeaponSwings,
    MostMeleeWeaponHits,
    MostDroneKills,
    MostSentryKills,
    MostPrisonerKills,
    MostPuppetsKnockedOut,
    MostFirearmKills,
    MostBareHandedKills,
    MostDeathsByPrisoners,
    HighestAllKD,
    HighestPrisonerKD,
    HighestAccuracy,
    PlayTimes
  };
}
