import { Database } from 'sql.js';

export interface StatLeaderboardEntry {
  // user_profile
  id: number;
  name: string;
  user_id: string;
  playTimeMinutes: number;
  famePoints: number;
  money_balance: number;
  last_login_time?: string;
  last_logout_time?: string;
  has_used_new_player_protection?: boolean;
  creation_time?: string;
  // prisoner
  gender: 'Male' | 'Female' | 'Unknown';
  is_alive?: boolean;
  age?: number;
  // survival_stats
  kills?: number;
  deaths?: number;
  minutes_survived?: number;
  animals_killed?: number;
  headshots?: number;
  // fishing_stats
  fish_caught?: number;
  heaviest_fish_caught?: number;
  // extracted from template_xml
  strength?: string;
  constitution?: string;
  dexterity?: string;
  intelligence?: string;
  // Add more fields as needed
}

// Helper to extract stat from template_xml
function extractStat(xml: string, stat: string): string | undefined {
  const match = xml.match(new RegExp(`${stat}="([^"]*)"`));
  return match ? match[1] : undefined;
}

// Helper to map gender int to string
function mapGender(gender: number): 'Male' | 'Female' | 'Unknown' {
  if (gender === 1) return 'Female';
  if (gender === 2) return 'Male';
  return 'Unknown';
}

/**
 * Extracts and transforms leaderboard data from the database for Stat_Leaderboards.
 * Applies all documented transformation rules.
 */
export function getStatLeaderboardData(db: Database): StatLeaderboardEntry[] {
  // Join user_profile, prisoner, survival_stats, fishing_stats
  const query = `
    SELECT
      up.id, up.name, up.user_id, up.play_time, up.fame_points, up.money_balance, up.last_login_time, up.last_logout_time, up.has_used_new_player_protection, up.creation_time, up.template_xml,
      p.gender, p.is_alive, p.age,
      ss.kills, ss.deaths, ss.minutes_survived, ss.animals_killed, ss.headshots,
      fs.fish_caught, fs.heaviest_fish_caught
    FROM user_profile up
    LEFT JOIN prisoner p ON up.prisoner_id = p.id
    LEFT JOIN survival_stats ss ON up.id = ss.user_profile_id
    LEFT JOIN fishing_stats fs ON up.id = fs.user_profile_id
  `;
  const result = db.exec(query);
  if (!result[0]) return [];
  const cols = result[0].columns;
  return result[0].values.map(row => {
    const obj: Record<string, any> = {};
    cols.forEach((col, i) => { obj[col] = row[i]; });
    return {
      id: obj.id,
      name: obj.name,
      user_id: obj.user_id,
      playTimeMinutes: obj.play_time ? Math.round(obj.play_time / 60) : 0,
      famePoints: obj.fame_points ?? 0,
      money_balance: obj.money_balance ?? 0,
      last_login_time: obj.last_login_time,
      last_logout_time: obj.last_logout_time,
      has_used_new_player_protection: obj.has_used_new_player_protection,
      creation_time: obj.creation_time,
      gender: mapGender(obj.gender),
      is_alive: obj.is_alive === undefined ? undefined : Boolean(obj.is_alive),
      age: obj.age,
      kills: obj.kills,
      deaths: obj.deaths,
      minutes_survived: obj.minutes_survived,
      animals_killed: obj.animals_killed,
      headshots: obj.headshots,
      fish_caught: obj.fish_caught,
      heaviest_fish_caught: obj.heaviest_fish_caught,
      strength: obj.template_xml ? extractStat(obj.template_xml, 'Strength') : undefined,
      constitution: obj.template_xml ? extractStat(obj.template_xml, 'Constitution') : undefined,
      dexterity: obj.template_xml ? extractStat(obj.template_xml, 'Dexterity') : undefined,
      intelligence: obj.template_xml ? extractStat(obj.template_xml, 'Intelligence') : undefined,
    };
  });
}
