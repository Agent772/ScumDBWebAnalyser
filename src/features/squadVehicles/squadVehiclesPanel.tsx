/**
 * Renders the Vehicles per Squad analysis panel.
 *
 * This panel displays a hierarchical, filterable, and collapsible table of squads, their members, and each member's vehicles.
 * Users can filter by squad name, member name, vehicle ID, or vehicle class. The panel also provides options to download the
 * filtered analysis as a TXT file or send it to a Discord webhook as an attachment.
 *
 * Features:
 * - Expand/collapse squads and members to view vehicles.
 * - Filter squads, members, and vehicles using input fields.
 * - Download the current analysis as a TXT file.
 * - Send the analysis to Discord via a webhook (with optional message).
 * - Accessibility features such as ARIA labels and keyboard navigation.
 *
 * @param {object} props - The component props.
 * @param {Database} props.db - The SQL.js database instance to query squad and vehicle data from.
 * @returns {JSX.Element} The rendered Vehicles per Squad analysis panel.
 */
import { Database } from 'sql.js';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DiscordModal } from '../../ui/Discord/DiscordModal';
import { postToDiscordWebhook } from '../../ui/Discord/discordWebhook';
import type { DiscordWebhookInfo } from '../../ui/Discord/DiscordModal';
import '../../ui/analysisTable.css';
import '../../index.css'; // Ensure styles are applied
import { DiscordIcon } from '../../ui/Discord/DiscordIcon';
import { getSquadVehiclesAnalytics } from './squadVehiclesData';
import type { SquadGroup } from './squadVehiclesData';
import { COLORS } from '../../ui/helpers/colors';

interface squadVehicleProps {
  db: Database;
}

export function SquadVehiclesPanel({ db }: squadVehicleProps) {
  const { t } = useTranslation();
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
      txt += `${squad.squadName}  (${t('members', { count: squad.members.length })}, ${t('squad_vehicles_panel.vehicles', { count: squadVehicleCount(squad) })})\n`;
      filteredMembers.forEach(member => {
        txt += `  ${member.name}  (${t('squad_vehicles_panel.vehicles', { count: member.vehicles.length })})\n`;
        // Filter vehicles for this member
        const filteredVehicles = member.vehicles.filter(v =>
          (filter.vehicle_id === '' || String(v.vehicle_id).includes(filter.vehicle_id)) &&
          v.vehicle_class.toLowerCase().includes(filter.vehicle_class.toLowerCase())
        );
        if (filteredVehicles.length === 0) {
          txt += `    – ${t('squad_vehicles_panel.no_vehicles')} –\n`;
        } else {
          filteredVehicles.forEach(v => {
            txt += `    ${v.vehicle_id}\t${v.vehicle_class}\n`;
          });
        }
      });
      txt += '\n';
    });
    if (!txt.trim()) txt = t('no_squads_or_members');
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
  // Discord status: { type: 'success' | 'error', message: string }
  const [discordStatus, setDiscordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Generate the analysis txt (same as download, but as string)
  function getAnalysisTxt() {
    let txt = t('squad_vehicles_panel.panel_header') + '\n\n';
    const filteredSquads = squadGroups.filter(sq => sq.squadName.toLowerCase().includes(filter.squad.toLowerCase()));
    filteredSquads.forEach(squad => {
      const filteredMembers = squad.members.filter(m => m.name.toLowerCase().includes(filter.member.toLowerCase()));
      if (filteredMembers.length === 0) return;
      txt += `${squad.squadName}  (${t('members', { count: squad.members.length })}, ${t('squad_vehicles_panel.vehicles', { count: squadVehicleCount(squad) })})\n`;
      filteredMembers.forEach(member => {
        txt += `  ${member.name}  (${t('squad_vehicles_panel.vehicles', { count: member.vehicles.length })})\n`;
        const filteredVehicles = member.vehicles.filter(v =>
          (filter.vehicle_id === '' || String(v.vehicle_id).includes(filter.vehicle_id)) &&
          v.vehicle_class.toLowerCase().includes(filter.vehicle_class.toLowerCase())
        );
        if (filteredVehicles.length === 0) {
          txt += `    – ${t('squad_vehicles_panel.no_vehicles')} –\n`;
        } else {
          filteredVehicles.forEach(v => {
            txt += `    ${v.vehicle_id}\t${v.vehicle_class}\n`;
          });
        }
      });
      txt += '\n';
    });
    if (!txt.trim()) txt = t('no_squads_or_members');
    return txt;
  }

  // Handle Discord send
  async function handleDiscordSend(info: DiscordWebhookInfo) {
    setDiscordStatus(null);
    const txt = getAnalysisTxt();
    if (!txt.trim()) {
      setDiscordStatus({ type: 'error', message: t('analysis_empty') });
      return;
    }
    // Create a Blob for the file attachment
    const file = new Blob([txt], { type: 'text/plain' });
    const filename = 'squad-vehicles.txt';
    // Optionally include a message above the file
    const content = info.message ? info.message : '';
    const ok = await postToDiscordWebhook(info, content, file, filename);
    setDiscordStatus(ok
      ? { type: 'success', message: t('discord.posted') }
      : { type: 'error', message: t('discord.failed') }
    );
    if (ok) setDiscordOpen(false);
  }

  // Render
  return (
    <section style={{ width: '100%' }} aria-label={t('squad_vehicles_panel.panel_header')} role="region">
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
          aria-label={t('download_txt')}
          style={{ marginTop: 0 }}
          onClick={downloadTxt}
        >
          {t('download_txt')}
        </button>
        <button
          type="button"
          className="btn-discord"
          aria-label={t('discord.post_to_discord')}
          style={{ marginTop: 0 }}
          onClick={() => setDiscordOpen(true)}
        >
          <DiscordIcon width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {t('discord.post_to_discord')}
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
        {t('squad_vehicles_panel.panel_header')}
      </h2>
      <div className="analysis-table-filters" aria-label={t('table_filters_aria')}>
        <input className="analysis-table-filter" placeholder={t('filter_squad')} value={filter.squad} onChange={e => setFilter(f => ({ ...f, squad: e.target.value }))} aria-label={t('filter_squad')} />
        <input className="analysis-table-filter" placeholder={t('filter_member')} value={filter.member} onChange={e => setFilter(f => ({ ...f, member: e.target.value }))} aria-label={t('filter_member')} />
        <input className="analysis-table-filter" placeholder={t('squad_vehicles_panel.filter_vehicle_id')} value={filter.vehicle_id} onChange={e => setFilter(f => ({ ...f, vehicle_id: e.target.value }))} aria-label={t('squad_vehicles_panel.filter_vehicle_id')} />
        <input className="analysis-table-filter" placeholder={t('squad_vehicles_panel.filter_vehicle_class')} value={filter.vehicle_class} onChange={e => setFilter(f => ({ ...f, vehicle_class: e.target.value }))} aria-label={t('squad_vehicles_panel.filter_vehicle_class')} />
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
          style={{ color: discordStatus.type === 'success' ? COLORS.success : COLORS.error, fontWeight: 600, margin: '10px 0' }}
        >
          {discordStatus.message}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="analysis-table" aria-label={t('squad_vehicles_panel.table_aria_label')}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>{t('squad_vehicles_panel.table_col_squad_member_vehicle')}</th>
              <th style={{ width: '20%' }}>{t('squad_vehicles_panel.table_col_vehicle_id')}</th>
              <th style={{ width: '40%' }}>{t('squad_vehicles_panel.table_col_vehicle_class')}</th>
            </tr>
          </thead>
          <tbody>
            {squadGroups.length === 0 && (
              <tr><td colSpan={3} className="no-vehicles-row">{t('no_squads_or_members')}</td></tr>
            )}
            {squadGroups.filter(sq => sq.squadName.toLowerCase().includes(filter.squad.toLowerCase())).map((squad, sIdx) => {
              // Filter members
              const filteredMembers = squad.members.filter(m => m.name.toLowerCase().includes(filter.member.toLowerCase()));
              if (filteredMembers.length === 0) return null;
              const squadOpen = openSquads[squad.squadName] !== false;
              return (
                <React.Fragment key={squad.squadName + sIdx}>
                  <tr className="squad-row" onClick={() => toggleSquad(squad.squadName)} tabIndex={0} aria-label={t('squad_vehicles_panel.squad_aria_label', { name: squad.squadName, members: squad.members.length, vehicles: squadVehicleCount(squad) })}>
                    <td className="squad-cell" colSpan={3}>
                      <span className="arrow" aria-hidden="true">{squadOpen ? '▼' : '▶'}</span>{squad.squadName}
                      <span className="count">
                        ({t('members', { count: squad.members.length })}, {t('squad_vehicles_panel.vehicles', { count: squadVehicleCount(squad) })})
                      </span>
                    </td>
                  </tr>
                  {squadOpen && filteredMembers.map((member, mIdx) => {
                    const memberKey = squad.squadName + '|' + member.name;
                    const memberOpen = openMembers[memberKey] !== false;
                    // Filter vehicles
                    const filteredVehicles = member.vehicles.filter(v =>
                      (filter.vehicle_id === '' || String(v.vehicle_id).includes(filter.vehicle_id)) &&
                      v.vehicle_class.toLowerCase().includes(filter.vehicle_class.toLowerCase())
                    );
                    return (
                      <React.Fragment key={member.name + mIdx}>
                        <tr className="member-row" onClick={e => { e.stopPropagation(); toggleMember(squad.squadName, member.name); }} tabIndex={0} aria-label={t('squad_vehicles_panel.member_aria_label', { name: member.name, vehicles: member.vehicles.length })}>
                          <td className="member-cell" colSpan={3}>
                            <span className="arrow" aria-hidden="true">{memberOpen ? '▼' : '▶'}</span>{member.name}
                            <span className="count">({t('squad_vehicles_panel.vehicles', { count: member.vehicles.length })})</span>
                          </td>
                        </tr>
                        {memberOpen && (filteredVehicles.length === 0 ? (
                          <tr className="no-vehicles-row">
                            <td className="vehicle-cell" colSpan={3}>– {t('squad_vehicles_panel.no_vehicles')} –</td>
                          </tr>
                        ) : (
                          filteredVehicles.map((v, vIdx) => (
                            <tr key={v.vehicle_id + vIdx} className="vehicle-row">
                              <td className="vehicle-cell"></td>
                              <td>{v.vehicle_id}</td>
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
