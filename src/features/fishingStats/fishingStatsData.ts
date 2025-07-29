import { Database } from 'sql.js';

export interface FishingStatsAnalytics {
  mostFishCaught: Array<{ name: string; count: number }>;
  heaviestFish: Array<{ name: string; weight: number }>;
  longestFish: Array<{ name: string; length: number }>;
  mostLinesBroken: Array<{ name: string; count: number }>;
}

export function getFishingStatsAnalytics(db: Database): FishingStatsAnalytics {
  // Most fish caught (top 10)
  const fishCaughtRes = db.exec(`
    SELECT up.name, fs.fish_caught
    FROM fishing_stats fs
    JOIN user_profile up ON fs.user_profile_id = up.id
    WHERE fs.fish_caught IS NOT NULL
    ORDER BY fs.fish_caught DESC
    LIMIT 10
  `);
  const mostFishCaught = fishCaughtRes[0]?.values.map(row => ({
    name: row[0] as string,
    count: row[1] as number,
  })) || [];

  // Heaviest fish caught (top 10)
  const heaviestFishRes = db.exec(`
    SELECT up.name, fs.heaviest_fish_caught
    FROM fishing_stats fs
    JOIN user_profile up ON fs.user_profile_id = up.id
    WHERE fs.heaviest_fish_caught IS NOT NULL
    ORDER BY fs.heaviest_fish_caught DESC
    LIMIT 10
  `);
  const heaviestFish = heaviestFishRes[0]?.values.map(row => ({
    name: row[0] as string,
    weight: row[1] as number,
  })) || [];

  // Longest fish caught (top 10)
  const longestFishRes = db.exec(`
    SELECT up.name, fs.longest_fish_caught
    FROM fishing_stats fs
    JOIN user_profile up ON fs.user_profile_id = up.id
    WHERE fs.longest_fish_caught IS NOT NULL
    ORDER BY fs.longest_fish_caught DESC
    LIMIT 10
  `);
  const longestFish = longestFishRes[0]?.values.map(row => ({
    name: row[0] as string,
    length: row[1] as number,
  })) || [];

  // Most broken fishing lines (top 10)
  const linesBrokenRes = db.exec(`
    SELECT up.name, fs.lines_broken
    FROM fishing_stats fs
    JOIN user_profile up ON fs.user_profile_id = up.id
    WHERE fs.lines_broken IS NOT NULL
    ORDER BY fs.lines_broken DESC
    LIMIT 10
  `);
  const mostLinesBroken = linesBrokenRes[0]?.values.map(row => ({
    name: row[0] as string,
    count: row[1] as number,
  })) || [];

  return {
    mostFishCaught,
    heaviestFish,
    longestFish,
    mostLinesBroken,
  };
}
