import { Database } from 'sql.js';

export interface SquadGroup {
  squadName: string;
  members: { name: string; vehicles: { entity_id: number; vehicle_class: string }[] }[];
}

export function getSquadVehiclesAnalytics(db: Database): SquadGroup[] {
  const squads = db.exec(`SELECT s.id as squad_id, s.name as squad_name, sm.user_profile_id, up.name as member_name
    FROM squad s
    LEFT JOIN squad_member sm ON sm.squad_id = s.id
    LEFT JOIN user_profile up ON up.id = sm.user_profile_id
    ORDER BY s.name, up.name`);
  const users = db.exec('SELECT id, name FROM user_profile');
  const itemEntities = db.exec(`
    SELECT ie.entity_id, ie.xml, e.owning_entity_id, e.class, e.reason
    FROM item_entity ie
    JOIN entity e ON e.id = ie.entity_id
    WHERE e.reason = 'AVehicleBase::BeginPlay'
  `);
  const userVehicles = new Map<number, { entity_id: number; vehicle_class: string }[]>();
  if (itemEntities[0]) {
    for (const row of itemEntities[0].values) {
      const entity_id = Number(row[0]);
      const xml = row[1];
      const vehicle_class = row[3] ? String(row[3]).replace('_Item_Container_ES', '') : '';
      if (typeof xml === 'string') {
        const match = xml.match(/_owningUserProfileId="(\d+)"/);
        if (match) {
          const user_profile_id = Number(match[1]);
          if (!userVehicles.has(user_profile_id)) userVehicles.set(user_profile_id, []);
          userVehicles.get(user_profile_id)!.push({ entity_id, vehicle_class });
        }
      }
    }
  }
  const userMap = new Map<number, string>();
  if (users[0]) {
    for (const row of users[0].values) {
      userMap.set(Number(row[0]), row[1] ? String(row[1]) : String(row[0]));
    }
  }
  const squadGroups: SquadGroup[] = [];
  if (squads[0]) {
    let group: SquadGroup | null = null;
    for (const row of squads[0].values) {
      const squad_name = row[1] || '(no name)';
      const user_profile_id = row[2];
      const member_name = row[3] || String(user_profile_id);
      if (!group || group.squadName !== squad_name) {
        if (group) squadGroups.push(group);
        group = { squadName: squad_name, members: [] };
      }
      const vehicles = userVehicles.get(user_profile_id) || [];
      group.members.push({ name: member_name, vehicles });
    }
    if (group) squadGroups.push(group);
  }
  return squadGroups;
}