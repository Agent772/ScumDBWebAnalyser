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
import { getSquadBaseData } from './squadBasesData';
import type { SquadGroupBases } from './squadBasesData';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { COLORS } from '../../ui/helpers/colors';
import { Tooltip } from '../../ui/helpers/Tooltip';
import { BaseLocationMapPreview } from '../../ui/helpers/BaseLocationMapPreview';

interface squadBaseProps {
  db: Database;
}

export function SquadBasesPanel({ db }: squadBaseProps) {
  const { t } = useTranslation();
  const squadGroups = getSquadBaseData(db);

  // State for copy feedback
  const [copiedLoc, setCopiedLoc] = useState<string | null>(null);

  // Helper: count bases in squad
  function squadBaseCount(squad: SquadGroupBases) {
    return squad.members.reduce((sum, m) => sum + m.bases.length, 0);
  }

  // Filtering state
  const [filter, setFilter] = useState({
    squad: '',
    member: '',
    base_location: '',
  });

  // Clipboard copy handler
  function copyTeleport(x: number, y: number) {
    const cmd = `#teleport ${x} ${y} 0`;
    navigator.clipboard.writeText(cmd);
  }


  // Download as txt
  function downloadTxt() {
    let txt = '';
    // Only include squads/members/bases that match the current filter
    const filteredSquads = squadGroups.filter(sq => sq.squadName.toLowerCase().includes(filter.squad.toLowerCase()));
    filteredSquads.forEach(squad => {
      // Check if any member matches
      const filteredMembers = squad.members.filter(m => m.name.toLowerCase().includes(filter.member.toLowerCase()));
      if (filteredMembers.length === 0) return;
      txt += `${squad.squadName}  (${t('members', { count: squad.members.length })}, ${t('squad_base_panel.bases', { count: squadBaseCount(squad) })})\n`;
      filteredMembers.forEach(member => {
        txt += `  ${member.name}  (${t('squad_base_panel.bases', { count: member.bases.length })})\n`;
        // Filter bases for this member
        const filteredBases = member.bases.filter(b =>
          filter.base_location === '' || `${b.location_x},${b.location_y}`.includes(filter.base_location)
        );
        if (filteredBases.length === 0) {
          txt += `    – ${t('squad_base_panel.no_bases')} –\n`;
        } else {
          filteredBases.forEach(b => {
            txt += `    (${b.location_x}, ${b.location_y})\n`;
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
    a.download = 'squad-bases.txt';
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
              updated[squad + '|' + m.name] = m.bases && m.bases.length > 0;
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
    let txt = t('squad_base_panel.panel_header') + '\n\n';
    const filteredSquads = squadGroups.filter(sq => sq.squadName.toLowerCase().includes(filter.squad.toLowerCase()));
    filteredSquads.forEach(squad => {
      const filteredMembers = squad.members.filter(m => m.name.toLowerCase().includes(filter.member.toLowerCase()));
      if (filteredMembers.length === 0) return;
      txt += `${squad.squadName}  (${t('members', { count: squad.members.length })}, ${t('squad_base_panel.bases', { count: squadBaseCount(squad) })})\n`;
      filteredMembers.forEach(member => {
        txt += `  ${member.name}  (${t('squad_base_panel.bases', { count: member.bases.length })})\n`;
        const filteredBases = member.bases.filter(b =>
          filter.base_location === '' || `${b.location_x},${b.location_y}`.includes(filter.base_location)
        );
        if (filteredBases.length === 0) {
          txt += `    – ${t('squad_base_panel.no_bases')} –\n`;
        } else {
          filteredBases.forEach(b => {
            txt += `    (${b.location_x}, ${b.location_y})\n`;
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
    const filename = 'squad-bases.txt';
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
    <section style={{ width: '100%' }} aria-label={t('squad_base_panel.panel_header')} role="region">
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
        {t('squad_base_panel.panel_header')}
      </h2>
      <div className="analysis-table-filters" aria-label={t('table_filters_aria')}>
        <input className="analysis-table-filter" placeholder={t('filter_squad')} value={filter.squad} onChange={e => setFilter(f => ({ ...f, squad: e.target.value }))} aria-label={t('filter_squad')} />
        <input className="analysis-table-filter" placeholder={t('filter_member')} value={filter.member} onChange={e => setFilter(f => ({ ...f, member: e.target.value }))} aria-label={t('filter_member')} />
        <input className="analysis-table-filter" placeholder={t('squad_base_panel.filter_base_location')} value={filter.base_location} onChange={e => setFilter(f => ({ ...f, base_location: e.target.value }))} aria-label={t('squad_base_panel.filter_base_location')} />
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
        <table className="analysis-table" aria-label={t('squad_base_panel.table_aria_label')}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>{t('squad_base_panel.table_col_squad_member')}</th>
              <th style={{ width: '60%' }}>{t('squad_base_panel.table_col_base_location')}</th>
            </tr>
          </thead>
          <tbody>
            {squadGroups.length === 0 && (
              <tr><td colSpan={3} className="no-bases-row">{t('no_squads_or_members')}</td></tr>
            )}
            {squadGroups.filter(sq => sq.squadName.toLowerCase().includes(filter.squad.toLowerCase())).map((squad, sIdx) => {
              // Filter members
              const filteredMembers = squad.members.filter(m => m.name.toLowerCase().includes(filter.member.toLowerCase()));
              if (filteredMembers.length === 0) return null;
              const squadOpen = openSquads[squad.squadName] !== false;
              return (
                <React.Fragment key={squad.squadName + sIdx}>
                  <tr className="squad-row" onClick={() => toggleSquad(squad.squadName)} tabIndex={0} aria-label={t('squad_base_panel.squad_aria_label', { name: squad.squadName, members: squad.members.length, bases: squadBaseCount(squad) })}>
                    <td className="squad-cell" colSpan={3}>
                      <span className="arrow" aria-hidden="true">{squadOpen ? '▼' : '▶'}</span>{squad.squadName}
                      <span className="count">
                        ({t('members', { count: squad.members.length })}, {t('squad_base_panel.bases', { count: squadBaseCount(squad) })})
                      </span>
                    </td>
                  </tr>
                  {squadOpen && filteredMembers.map((member, mIdx) => {
                    const memberKey = squad.squadName + '|' + member.name;
                    const memberOpen = openMembers[memberKey] !== false;
                    // Filter bases
                    const filteredBases = member.bases.filter(b =>
                      filter.base_location === '' || `${b.location_x},${b.location_y}`.includes(filter.base_location)
                    );
                    return (
                      <React.Fragment key={member.name + mIdx}>
                        <tr className="member-row" onClick={e => { e.stopPropagation(); toggleMember(squad.squadName, member.name); }} tabIndex={0} aria-label={t('squad_base_panel.member_aria_label', { name: member.name, bases: member.bases.length })}>
                          <td className="member-cell" colSpan={3}>
                            <span className="arrow" aria-hidden="true">{memberOpen ? '▼' : '▶'}</span>{member.name}
                            <span className="count">({t('squad_base_panel.bases', { count: member.bases.length })})</span>
                          </td>
                        </tr>
                        {memberOpen && (filteredBases.length === 0 ? (
                          <tr className="no-bases-row">
                            <td className="base-cell" colSpan={2}>– {t('squad_base_panel.no_bases')} –</td>
                          </tr>
                        ) : (
                          filteredBases.map((b, bIdx) => (
                            <tr key={b.location_x + ',' + b.location_y + bIdx} className="base-row">
                              <td className="base-cell"></td>
                              <td>
                                <Tooltip
                                  content={<BaseLocationMapPreview x={b.location_x} y={b.location_y} />}
                                  placement="top"
                                >
                                  <span
                                    style={{ cursor: 'pointer', textDecoration: 'underline dotted', color: COLORS.primary }}
                                    tabIndex={0}
                                    aria-label={t('squad_base_panel.show_on_map')}
                                    onClick={() => {
                                      copyTeleport(b.location_x, b.location_y);
                                      setCopiedLoc(`${b.location_x},${b.location_y}`);
                                      setTimeout(() => setCopiedLoc(null), 1200);
                                    }}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        copyTeleport(b.location_x, b.location_y);
                                        setCopiedLoc(`${b.location_x},${b.location_y}`);
                                        setTimeout(() => setCopiedLoc(null), 1200);
                                      }
                                    }}
                                    role="button"
                                  >
                                    {b.location_x}, {b.location_y}
                                  </span>
                                </Tooltip>
                              </td>
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
      {/* Copied notification */}
      {copiedLoc && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 32,
            transform: 'translateX(-50%)',
            background: COLORS.success,
            color: '#fff',
            padding: '12px 32px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1.1rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: 0.97,
            transition: 'opacity 0.2s',
          }}
          role="status"
          aria-live="polite"
        >
          {t('squad_base_panel.copied_teleport')}
        </div>
      )}
    </section>
  );
}
