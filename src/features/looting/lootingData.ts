/**
 * Fetches all looting statistics from the provided SQLite database and organizes them into memory.
 *
 * Executes a single query joining `user_profile` and `survival_stats` tables, then maps the results
 * into arrays of `ChartEntry` objects for various looting KPIs, as well as an array of play times.
 *
 * @param db - The SQLite database instance to query.
 * @returns An object containing arrays of looting statistics and play times for all users.
 */
import { Database } from 'sql.js';
import type { ChartEntry } from '../../utils/types/ChartData';

// Internal structure to hold all looting stats in memory after one DB query
interface AllLootingStats {
  ContainersLooted: ChartEntry[];
  ItemsPutIntoContainers: ChartEntry[];
  HighestWeightCarried: ChartEntry[];
  LocksPicked: ChartEntry[];
  ItemsPickedUp: ChartEntry[];
  PlayTimes: number[];
}

export function fetchAllLootingStats(db: Database): AllLootingStats {
  const res = db.exec(`
    SELECT up.name, up.play_time / 60 AS play_time,
      s.containers_looted,
      s.items_put_into_containers,
      s.highest_weight_carried,
      s.locks_picked,
      s.items_picked_up
    FROM user_profile up
    JOIN survival_stats s ON up.id = s.user_profile_id
  `);

  if (!res || res.length === 0) {
    return {
      ContainersLooted: [],
      ItemsPutIntoContainers: [],
      HighestWeightCarried: [],
      LocksPicked: [],
      ItemsPickedUp: [],
      PlayTimes: [],
    };
  }

  const { columns, values } = res[0];

  const ContainersLooted: ChartEntry[] = [];
  const ItemsPutIntoContainers: ChartEntry[] = [];
  const HighestWeightCarried: ChartEntry[] = [];
  const LocksPicked: ChartEntry[] = [];
  const ItemsPickedUp: ChartEntry[] = [];
  const PlayTimes: number[] = [];

  for (const row of values) {
    const name = row[columns.indexOf('name')] as string;
    const playTime = row[columns.indexOf('play_time')] as number;
    const containersLooted = row[columns.indexOf('containers_looted')] as number;
    const itemsPutIntoContainers = row[columns.indexOf('items_put_into_containers')] as number;
    const highestWeightCarried = row[columns.indexOf('highest_weight_carried')] as number;
    const locksPicked = row[columns.indexOf('locks_picked')] as number;
    const itemsPickedUp = row[columns.indexOf('items_picked_up')] as number;

    ContainersLooted.push({ name, kpi: containersLooted, colorCodingKpi: playTime });
    ItemsPutIntoContainers.push({ name, kpi: itemsPutIntoContainers, colorCodingKpi: itemsPickedUp });
    HighestWeightCarried.push({ name, kpi: highestWeightCarried, colorCodingKpi: playTime });
    LocksPicked.push({ name, kpi: locksPicked, colorCodingKpi: playTime });
    ItemsPickedUp.push({ name, kpi: itemsPickedUp, colorCodingKpi: playTime });
    PlayTimes.push(playTime);
  }

  return {
    ContainersLooted,
    ItemsPutIntoContainers,
    HighestWeightCarried,
    LocksPicked,
    ItemsPickedUp,
    PlayTimes
  };
}
