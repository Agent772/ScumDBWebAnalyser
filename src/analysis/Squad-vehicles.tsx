import { Database } from 'sql.js';
// No BLOB parsing needed for vehicle ownership
import React from 'react';

interface Analysis1Props {
  db: Database;
}

interface SquadGroup {
  squadName: string;
  members: { name: string; vehicles: number[] }[];
}

export function SquadVehicles({ db }: Analysis1Props) {
  // ---
  // Query all needed data
  const squads = db.exec(`SELECT s.id as squad_id, s.name as squad_name, sm.user_profile_id, up.name as member_name
    FROM squad s
    LEFT JOIN squad_member sm ON sm.squad_id = s.id
    LEFT JOIN user_profile up ON up.id = sm.user_profile_id
    ORDER BY s.name, up.name`);
  const users = db.exec('SELECT id, name FROM user_profile');
  // Find all item_entity rows that are vehicles owned by users
  // (xml contains _owningUserProfileId="USER_ID" and entity.reason = 'AVehicleBase::BeginPlay')
  const itemEntities = db.exec(`
    SELECT ie.entity_id, ie.xml, e.owning_entity_id, e.class, e.reason
    FROM item_entity ie
    JOIN entity e ON e.id = ie.entity_id
    WHERE e.reason = 'AVehicleBase::BeginPlay'
  `);
  // Map: user_profile_id -> vehicles[]
  const userVehicles = new Map<number, { entity_id: number }[]>();
  if (itemEntities[0]) {
    for (const row of itemEntities[0].values) {
      const entity_id = Number(row[0]);
      const xml = row[1];
      if (typeof xml === 'string') {
        // Look for _owningUserProfileId="12345"
        const match = xml.match(/_owningUserProfileId=\"(\d+)\"/);
        if (match) {
          const user_profile_id = Number(match[1]);
          if (!userVehicles.has(user_profile_id)) userVehicles.set(user_profile_id, []);
          userVehicles.get(user_profile_id)!.push({ entity_id });
        }
      }
    }
  }

  // Build lookup maps
  const userMap = new Map<number, string>();
  if (users[0]) {
    for (const row of users[0].values) {
      userMap.set(Number(row[0]), row[1] ? String(row[1]) : String(row[0]));
    }
  }

  // No BLOB debug needed for this approach

  // Group by squads
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
      group.members.push({ name: member_name, vehicles: vehicles.map(v => v.entity_id) });
    }
    if (group) squadGroups.push(group);
  }

  // Render
  return (
    <div>
      <h2 style={{ color: '#f7b801', marginBottom: 24 }}>Vehicles per Squad</h2>
      {squadGroups.length === 0 && <div>No squads or members found.</div>}
      {squadGroups.map((squad) => (
        <div key={squad.squadName} style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f7b801' }}>🚩 Squad: {squad.squadName}</div>
          {squad.members.map((member) => (
            <div key={member.name} style={{ marginLeft: 16, marginTop: 4 }}>
              <span style={{ fontWeight: 600 }}>👤 {member.name}</span>
              {member.vehicles.length === 0 ? (
                <span style={{ color: '#bbb', marginLeft: 8 }}>– no Vehicles –</span>
              ) : (
                <ul style={{ margin: '4px 0 4px 24px', padding: 0 }}>
                  {member.vehicles.map((vid) => (
                    <li key={vid} style={{ color: '#fff' }}>• Vehicle ID: {vid}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
