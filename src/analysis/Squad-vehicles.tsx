import { Database } from 'sql.js';
import React, { useState } from 'react';

import { DiscordModal } from '../utils/DiscordModal';
import { postToDiscordWebhook } from '../utils/discordWebhook';
import type { DiscordWebhookInfo } from '../utils/DiscordModal';
import './AnalysisTable.css';

interface Analysis1Props {
  db: Database;
}

interface SquadGroup {
  squadName: string;
  members: { name: string; vehicles: { entity_id: number; vehicle_class: string }[] }[];
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
  // Map: user_profile_id -> vehicles[] (with class)
  const userVehicles = new Map<number, { entity_id: number; vehicle_class: string }[]>();
  if (itemEntities[0]) {
    for (const row of itemEntities[0].values) {
      const entity_id = Number(row[0]);
      const xml = row[1];
      const vehicle_class = row[3] ? String(row[3]).replace('_Item_Container_ES', '') : '';
      if (typeof xml === 'string') {
        // Look for _owningUserProfileId="12345"
        const match = xml.match(/_owningUserProfileId="(\d+)"/);
        if (match) {
          const user_profile_id = Number(match[1]);
          if (!userVehicles.has(user_profile_id)) userVehicles.set(user_profile_id, []);
          userVehicles.get(user_profile_id)!.push({ entity_id, vehicle_class });
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
      group.members.push({ name: member_name, vehicles });
    }
    if (group) squadGroups.push(group);
  }

  // Helper: count vehicles in squad
  function squadVehicleCount(squad: SquadGroup) {
    return squad.members.reduce((sum, m) => sum + m.vehicles.length, 0);
  }

  // Flatten data for table
  const flatRows: { squad: string; member: string; vehicle_id: number; vehicle_class: string }[] = [];
  squadGroups.forEach((squad) => {
    squad.members.forEach((member) => {
      if (member.vehicles.length === 0) {
        flatRows.push({
          squad: squad.squadName,
          member: member.name,
          vehicle_id: 0,
          vehicle_class: '',
        });
      } else {
        member.vehicles.forEach((v) => {
          flatRows.push({
            squad: squad.squadName,
            member: member.name,
            vehicle_id: v.entity_id,
            vehicle_class: v.vehicle_class,
          });
        });
      }
    });
  });

  // Filtering state
  const [filter, setFilter] = useState({
    squad: '',
    member: '',
    vehicle_id: '',
    vehicle_class: '',
  });

  // (filteredRows is not used in the UI, so removed to avoid lint error)

  // Download as txt
  function downloadTxt() {
    let txt = '';
    // Only include squads/members/vehicles that match the current filter
    const filteredSquads = squadGroups.filter(sq => sq.squadName.toLowerCase().includes(filter.squad.toLowerCase()));
    filteredSquads.forEach(squad => {
      // Check if any member matches
      const filteredMembers = squad.members.filter(m => m.name.toLowerCase().includes(filter.member.toLowerCase()));
      if (filteredMembers.length === 0) return;
      txt += `${squad.squadName}  (members: ${squad.members.length}, vehicles: ${squadVehicleCount(squad)})\n`;
      filteredMembers.forEach(member => {
        txt += `  ${member.name}  (vehicles: ${member.vehicles.length})\n`;
        // Filter vehicles for this member
        const filteredVehicles = member.vehicles.filter(v =>
          (filter.vehicle_id === '' || String(v.entity_id).includes(filter.vehicle_id)) &&
          v.vehicle_class.toLowerCase().includes(filter.vehicle_class.toLowerCase())
        );
        if (filteredVehicles.length === 0) {
          txt += `    – no Vehicles –\n`;
        } else {
          filteredVehicles.forEach(v => {
            txt += `    ${v.entity_id}\t${v.vehicle_class}\n`;
          });
        }
      });
      txt += '\n';
    });
    if (!txt.trim()) txt = 'No squads or members found.';
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'squad-vehicles.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Expand/collapse state
  const [openSquads, setOpenSquads] = useState<{ [squad: string]: boolean }>(() => {
    // All squads collapsed by default
    const initial: { [s: string]: boolean } = {};
    squadGroups.forEach(sq => { initial[sq.squadName] = false; });
    return initial;
  });
  const [openMembers, setOpenMembers] = useState<{ [key: string]: boolean }>({});

  // When a squad is opened, expand all its members by default
  function toggleSquad(squad: string) {
    setOpenSquads((prev) => {
      const current = prev[squad];
      const newState = { ...prev, [squad]: current === undefined ? false : !current };
      // If opening, expand all members in this squad
      if (!current) {
        setOpenMembers((prevMembers) => {
          const updated = { ...prevMembers };
          const squadObj = squadGroups.find(sq => sq.squadName === squad);
          if (squadObj) {
            squadObj.members.forEach(m => {
              if (m.vehicles && m.vehicles.length > 0) {
                updated[squad + '|' + m.name] = true;
              } else {
                updated[squad + '|' + m.name] = false;
              }
            });
          }
          return updated;
        });
      }
      return newState;
    });
  }

  function toggleMember(squad: string, member: string) {
    setOpenMembers((prev) => {
      const key = squad + '|' + member;
      const current = prev[key];
      return { ...prev, [key]: current === undefined ? false : !current };
    });
  }

  // Discord modal state
  const [discordOpen, setDiscordOpen] = useState(false);
  const [discordStatus, setDiscordStatus] = useState<string | null>(null);
  // (discordLoading is not used in the UI, so removed to avoid lint error)

  // Generate the analysis txt (same as download, but as string)
  function getAnalysisTxt() {
    let txt = 'Vehicles per Squad Analysis\n\n';
    const filteredSquads = squadGroups.filter(sq => sq.squadName.toLowerCase().includes(filter.squad.toLowerCase()));
    filteredSquads.forEach(squad => {
      const filteredMembers = squad.members.filter(m => m.name.toLowerCase().includes(filter.member.toLowerCase()));
      if (filteredMembers.length === 0) return;
      txt += `${squad.squadName}  (members: ${squad.members.length}, vehicles: ${squadVehicleCount(squad)})\n`;
      filteredMembers.forEach(member => {
        txt += `  ${member.name}  (vehicles: ${member.vehicles.length})\n`;
        const filteredVehicles = member.vehicles.filter(v =>
          (filter.vehicle_id === '' || String(v.entity_id).includes(filter.vehicle_id)) &&
          v.vehicle_class.toLowerCase().includes(filter.vehicle_class.toLowerCase())
        );
        if (filteredVehicles.length === 0) {
          txt += `    – no Vehicles –\n`;
        } else {
          filteredVehicles.forEach(v => {
            txt += `    ${v.entity_id}\t${v.vehicle_class}\n`;
          });
        }
      });
      txt += '\n';
    });
    if (!txt.trim()) txt = 'No squads or members found.';
    return txt;
  }

  // Handle Discord send
  async function handleDiscordSend(info: DiscordWebhookInfo) {
    setDiscordStatus(null);
    const txt = getAnalysisTxt();
    if (!txt.trim()) {
      setDiscordStatus('Analysis is empty. Please adjust filters or data.');
      return;
    }
    // Create a Blob for the file attachment
    const file = new Blob([txt], { type: 'text/plain' });
    const filename = 'squad-vehicles.txt';
    // Optionally include a message above the file
    const content = info.message ? info.message : '';
    const ok = await postToDiscordWebhook(info, content, file, filename);
    setDiscordStatus(ok ? 'Posted to Discord with file attachment!' : 'Failed to post. Check the webhook URL and try again.');
    if (ok) setDiscordOpen(false);
  }

  // Render
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ color: '#f7b801', margin: 0 }}>Vehicles per Squad</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="analysis-discord-btn"
            type="button"
            onClick={() => setDiscordOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginRight: 6 }} xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.1a.074.074 0 0 0-.079.037c-.34.607-.719 1.396-.984 2.013a18.524 18.524 0 0 0-5.59 0 12.51 12.51 0 0 0-.997-2.013.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.069.069 0 0 0-.032.027C1.577 7.651.293 10.818.076 13.946a.08.08 0 0 0 .028.061c2.426 1.778 4.78 2.852 7.084 3.563a.077.077 0 0 0 .084-.027c.547-.75 1.035-1.539 1.426-2.362a.076.076 0 0 0-.041-.104c-.781-.297-1.523-.654-2.241-1.062a.077.077 0 0 1-.008-.127c.151-.114.302-.23.446-.346a.074.074 0 0 1 .077-.01c4.751 2.172 9.87 2.172 14.563 0a.075.075 0 0 1 .078.009c.144.116.295.232.447.346a.077.077 0 0 1-.006.127c-.719.408-1.461.765-2.242 1.062a.076.076 0 0 0-.04.105c.391.822.878 1.611 1.425 2.361a.076.076 0 0 0 .084.028c2.305-.711 4.659-1.785 7.084-3.563a.077.077 0 0 0 .028-.061c-.24-3.127-1.524-6.294-3.569-9.55a.07.07 0 0 0-.033-.027zM8.02 14.331c-1.01 0-1.845-.924-1.845-2.057 0-1.133.818-2.057 1.845-2.057 1.036 0 1.86.933 1.845 2.057 0 1.133-.818 2.057-1.845 2.057zm7.974 0c-1.01 0-1.845-.924-1.845-2.057 0-1.133.818-2.057 1.845-2.057 1.036 0 1.86.933 1.845 2.057 0 1.133-.818 2.057-1.845 2.057z" fill="#7289da"/>
            </svg>
            Send to Discord
          </button>
          <button className="analysis-table-download" onClick={downloadTxt}>Download as TXT</button>
        </div>
      </div>
      <div className="analysis-table-filters">
        <input className="analysis-table-filter" placeholder="Filter Squad" value={filter.squad} onChange={e => setFilter(f => ({ ...f, squad: e.target.value }))} />
        <input className="analysis-table-filter" placeholder="Filter Member" value={filter.member} onChange={e => setFilter(f => ({ ...f, member: e.target.value }))} />
        <input className="analysis-table-filter" placeholder="Filter Vehicle ID" value={filter.vehicle_id} onChange={e => setFilter(f => ({ ...f, vehicle_id: e.target.value }))} />
        <input className="analysis-table-filter" placeholder="Filter Vehicle Class" value={filter.vehicle_class} onChange={e => setFilter(f => ({ ...f, vehicle_class: e.target.value }))} />
      </div>
      {discordOpen && (
        <DiscordModal
          open={discordOpen}
          onClose={() => setDiscordOpen(false)}
          onSubmit={handleDiscordSend}
        />
      )}
      {discordStatus && (
        <div style={{ color: discordStatus.startsWith('Posted') ? '#43b581' : '#f04747', fontWeight: 600, margin: '10px 0' }}>{discordStatus}</div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="analysis-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Squad / Member / Vehicle</th>
              <th style={{ width: '20%' }}>Vehicle ID</th>
              <th style={{ width: '40%' }}>Vehicle Class</th>
            </tr>
          </thead>
          <tbody>
            {squadGroups.length === 0 && (
              <tr><td colSpan={3} className="no-vehicles-row">No squads or members found.</td></tr>
            )}
            {squadGroups.filter(sq => sq.squadName.toLowerCase().includes(filter.squad.toLowerCase())).map((squad, sIdx) => {
              // Filter members
              const filteredMembers = squad.members.filter(m => m.name.toLowerCase().includes(filter.member.toLowerCase()));
              if (filteredMembers.length === 0) return null;
              const squadOpen = openSquads[squad.squadName] !== false;
              return (
                <React.Fragment key={squad.squadName + sIdx}>
                  <tr className="squad-row" onClick={() => toggleSquad(squad.squadName)}>
                    <td className="squad-cell" colSpan={3}>
                      <span className="arrow">{squadOpen ? '▼' : '▶'}</span>{squad.squadName}
                      <span className="count">
                        ({squad.members.length} members, {squadVehicleCount(squad)} vehicles)
                      </span>
                    </td>
                  </tr>
                  {squadOpen && filteredMembers.map((member, mIdx) => {
                    const memberKey = squad.squadName + '|' + member.name;
                    const memberOpen = openMembers[memberKey] !== false;
                    // Filter vehicles
                    const filteredVehicles = member.vehicles.filter(v =>
                      (filter.vehicle_id === '' || String(v.entity_id).includes(filter.vehicle_id)) &&
                      v.vehicle_class.toLowerCase().includes(filter.vehicle_class.toLowerCase())
                    );
                    return (
                      <React.Fragment key={member.name + mIdx}>
                        <tr className="member-row" onClick={e => { e.stopPropagation(); toggleMember(squad.squadName, member.name); }}>
                          <td className="member-cell" colSpan={3}>
                            <span className="arrow">{memberOpen ? '▼' : '▶'}</span>{member.name}
                            <span className="count">({member.vehicles.length} vehicles)</span>
                          </td>
                        </tr>
                        {memberOpen && (filteredVehicles.length === 0 ? (
                          <tr className="no-vehicles-row">
                            <td className="vehicle-cell" colSpan={3}>– no Vehicles –</td>
                          </tr>
                        ) : (
                          filteredVehicles.map((v, vIdx) => (
                            <tr key={v.entity_id + vIdx} className="vehicle-row">
                              <td className="vehicle-cell"></td>
                              <td>{v.entity_id}</td>
                              <td>{v.vehicle_class}</td>
                            </tr>
                          ))
                        ))}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
