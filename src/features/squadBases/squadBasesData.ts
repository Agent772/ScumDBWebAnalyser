/**
 * Retrieves analytics about squad vehicles from the provided SQL.js database.
 *
 * This function queries the database for squads, their members, and the vehicles owned by each member.
 * It organizes the data into groups by squad, with each group containing the squad name and a list of members.
 * Each member includes their name and an array of vehicles they own, where each vehicle has its entity ID and class.
 *
 * @param db - The SQL.js `Database` instance to query.
 * @returns An array of `SquadGroup` objects, each representing a squad and its members with their vehicles.
 */
import { Database } from 'sql.js';


export interface SquadGroupBases {
  squadName: string;
  members: { name: string; bases: { location_x: number; location_y: number; }[] }[];
}


export function getSquadBaseData(db: Database): SquadGroupBases[] {
  const squads = db.exec(`SELECT 
      s.id as squad_id, 
      s.name as squad_name, 
      sm.user_profile_id, 
      up.name as member_name,
      b.location_x,
      b.location_y
    FROM squad s
    LEFT JOIN squad_member sm ON sm.squad_id = s.id
    LEFT JOIN user_profile up ON up.id = sm.user_profile_id
    LEFT JOIN base b on b.owner_user_profile_id = up.id
    where b.owner_user_profile_id > 0
    ORDER BY s.name, up.name`);

  type Row = [number, string, number, string, number, number];
  const squadGroups: SquadGroupBases[] = [];
  if (squads[0]) {
    let currentSquad: SquadGroupBases | null = null;
    let memberMap: Map<string, { name: string; bases: { location_x: number; location_y: number; }[] }> = new Map();

    for (const row of squads[0].values as Row[]) {
      const squad_name = row[1] || '(no name)';
      const member_name = row[3] || String(row[2]);
      const location_x = row[4];
      const location_y = row[5];

      if (!currentSquad || currentSquad.squadName !== squad_name) {
        if (currentSquad) {
          // Push previous squad group
          currentSquad.members = Array.from(memberMap.values());
          squadGroups.push(currentSquad);
        }
        currentSquad = { squadName: squad_name, members: [] };
        memberMap = new Map();
      }

      if (!memberMap.has(member_name)) {
        memberMap.set(member_name, { name: member_name, bases: [] });
      }
      // Only add base if location_x and location_y are valid numbers
      if (typeof location_x === 'number' && typeof location_y === 'number') {
        memberMap.get(member_name)!.bases.push({ location_x, location_y });
      }
    }
    if (currentSquad) {
      currentSquad.members = Array.from(memberMap.values());
      squadGroups.push(currentSquad);
    }
  }
  return squadGroups;
}