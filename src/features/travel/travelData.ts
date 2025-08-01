/**
 * Fetches all travel-related statistics for each user from the database and structures them for charting.
 *
 * Executes a single SQL query to retrieve user names, play times, and various distance metrics from the
 * `user_profile` and `survival_stats` tables. The results are mapped into arrays of `ChartEntry` objects
 * for each travel category, as well as an array of play times.
 *
 * @param db - The SQL.js `Database` instance to query.
 * @returns An `AllTravelStats` object containing arrays of travel statistics and play times.
 * - `MostDistanceTravelledByFoot`: Distance travelled by foot per user.
 * - `MostDistanceTravelledInVehicle`: Distance travelled in vehicles per user.
 * - `MostDistanceTravelledSwimming`: Distance travelled swimming per user.
 * - `MostDistanceTravelledByBoat`: Distance travelled by boat per user.
 * - `MostDistanceSailed`: Distance sailed per user.
 * - `PlayTimes`: Array of play times (in minutes) per user.
 */
import { Database } from 'sql.js';
import type { ChartEntry } from '../../utils/types/ChartData';

// Internal structure to hold all travel stats in memory after one DB query
interface AllTravelStats {
  MostDistanceTravelledByFoot: ChartEntry[];
  MostDistanceTravelledInVehicle: ChartEntry[];
  MostDistanceTravelledSwimming: ChartEntry[];
  MostDistanceTravelledByBoat: ChartEntry[];
  MostDistanceSailed: ChartEntry[];
  PlayTimes: number[];
}

export function fetchAllTravelStats(db: Database): AllTravelStats {
  const res = db.exec(`
    SELECT up.name, up.play_time / 60 AS play_time, 
      s.distance_travelled_by_foot, 
      s.distance_travelled_in_vehicle,
      s.distance_travelled_swimming,
      s.distance_travel_by_boat,
      s.distance_sailed
    FROM user_profile up
    JOIN survival_stats s ON up.id = s.user_profile_id
  `);

  if (!res || res.length === 0) {
    return {
      MostDistanceTravelledByFoot: [],
      MostDistanceTravelledInVehicle: [],
      MostDistanceTravelledSwimming: [],
      MostDistanceTravelledByBoat: [],
      MostDistanceSailed: [],
      PlayTimes: [],
    };
  }

  const { columns, values } = res[0];

  const MostDistanceTravelledByFoot: ChartEntry[] = [];
  const MostDistanceTravelledInVehicle: ChartEntry[] = [];
  const MostDistanceTravelledSwimming: ChartEntry[] = [];
  const MostDistanceTravelledByBoat: ChartEntry[] = [];
  const MostDistanceSailed: ChartEntry[] = [];
  const PlayTimes: number[] = [];

  for (const row of values) {
    const name = row[columns.indexOf('name')] as string;
    const playTime = row[columns.indexOf('play_time')] as number;
    const distanceTravelledByFoot = row[columns.indexOf('distance_travelled_by_foot')] as number;
    const distanceTravelledInVehicle = row[columns.indexOf('distance_travelled_in_vehicle')] as number;
    const distanceTravelledSwimming = row[columns.indexOf('distance_travelled_swimming')] as number;
    const distanceTravelByBoat = row[columns.indexOf('distance_travel_by_boat')] as number;
    const distanceSailed = row[columns.indexOf('distance_sailed')] as number;

    MostDistanceTravelledByFoot.push({ name, kpi: distanceTravelledByFoot, colorCodingKpi: playTime });
    MostDistanceTravelledInVehicle.push({ name, kpi: distanceTravelledInVehicle, colorCodingKpi: playTime });
    MostDistanceTravelledSwimming.push({ name, kpi: distanceTravelledSwimming, colorCodingKpi: playTime });
    MostDistanceTravelledByBoat.push({ name, kpi: distanceTravelByBoat, colorCodingKpi: playTime });
    MostDistanceSailed.push({ name, kpi: distanceSailed, colorCodingKpi: playTime });
    PlayTimes.push(playTime);
  }

  return {
    MostDistanceTravelledByFoot,
    MostDistanceTravelledInVehicle,
    MostDistanceTravelledSwimming,
    MostDistanceTravelledByBoat,
    MostDistanceSailed,
    PlayTimes
  };
}
