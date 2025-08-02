import { Database } from 'sql.js';
import React, { useState } from 'react';
import { DiscordModal } from '../../ui/Discord/DiscordModal';
import { postToDiscordWebhook } from '../../ui/Discord/discordWebhook';
import type { DiscordWebhookInfo } from '../../ui/Discord/DiscordModal';
import './SquadVehicleTable.css';
import '../../index.css'; // Ensure styles are applied
import { DiscordIcon } from '../../ui/Discord/DiscordIcon';
import { getSquadVehiclesAnalytics } from './squadVehiclesData';
import type { SquadGroup } from './squadVehiclesData';
import { COLORS } from '../../ui/helpers/colors';

interface squadVehicleProps {
  db: Database;
}


export function SquadVehiclesPanel({ db }: squadVehicleProps) {
  const squadGroups = getSquadVehiclesAnalytics(db);

  // Helper: count vehicles in squad
  function squadVehicleCount(squad: SquadGroup) {
    return squad.members.reduce((sum, m) => sum + m.vehicles.length, 0);
  }

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
    <section style={{ width: '100%' }} aria-label="Vehicles per Squad analysis" role="region">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
          marginTop: '2.5rem',
          marginBottom: 12,
        }}
      >
        <button
          type="button"
          className='btn-download'
          aria-label="Download as TXT"
          style={{ marginTop: 0 }}
          onClick={downloadTxt}
        >
          Download as TXT
        </button>
        <button
          type="button"
          className="btn-discord"
          aria-label="Send to Discord"
          style={{ marginTop: 0 }}
          onClick={() => setDiscordOpen(true)}
        >
          <DiscordIcon width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Send to Discord
        </button>
      </div>
      <h2
        style={{
          color: COLORS.primary,
          fontWeight: 700,
          fontSize: '2rem',
          margin: 0,
          textAlign: 'center',
          letterSpacing: '0.01em',
        }}
        tabIndex={0}
      >
        Vehicles per Squad
      </h2>
      <div className="analysis-table-filters" aria-label="Table filters">
        <input className="analysis-table-filter" placeholder="Filter Squad" value={filter.squad} onChange={e => setFilter(f => ({ ...f, squad: e.target.value }))} aria-label="Filter Squad" />
        <input className="analysis-table-filter" placeholder="Filter Member" value={filter.member} onChange={e => setFilter(f => ({ ...f, member: e.target.value }))} aria-label="Filter Member" />
        <input className="analysis-table-filter" placeholder="Filter Vehicle ID" value={filter.vehicle_id} onChange={e => setFilter(f => ({ ...f, vehicle_id: e.target.value }))} aria-label="Filter Vehicle ID" />
        <input className="analysis-table-filter" placeholder="Filter Vehicle Class" value={filter.vehicle_class} onChange={e => setFilter(f => ({ ...f, vehicle_class: e.target.value }))} aria-label="Filter Vehicle Class" />
      </div>
      {discordOpen && (
        <DiscordModal
          open={discordOpen}
          onClose={() => setDiscordOpen(false)}
          onSubmit={handleDiscordSend}
        />
      )}
      {discordStatus && (
        <div
          role="status"
          aria-live="polite"
          style={{ color: discordStatus.startsWith('Posted') ? COLORS.success : COLORS.error, fontWeight: 600, margin: '10px 0' }}
        >
          {discordStatus}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="analysis-table" aria-label="Vehicles per Squad table">
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
                  <tr className="squad-row" onClick={() => toggleSquad(squad.squadName)} tabIndex={0} aria-label={`Squad ${squad.squadName}, ${squad.members.length} members, ${squadVehicleCount(squad)} vehicles`}>
                    <td className="squad-cell" colSpan={3}>
                      <span className="arrow" aria-hidden="true">{squadOpen ? '▼' : '▶'}</span>{squad.squadName}
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
                        <tr className="member-row" onClick={e => { e.stopPropagation(); toggleMember(squad.squadName, member.name); }} tabIndex={0} aria-label={`Member ${member.name}, ${member.vehicles.length} vehicles`}>
                          <td className="member-cell" colSpan={3}>
                            <span className="arrow" aria-hidden="true">{memberOpen ? '▼' : '▶'}</span>{member.name}
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
    </section>
  );
}
