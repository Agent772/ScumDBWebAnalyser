import { useState } from 'react';
import initSqlJs, { Database } from 'sql.js';
import { SquadVehiclesPanel } from './features/squadVehicles/squadVehiclesPanel';
import { DemographicsAnalyticsPanel } from './features/demographics/DemographicsAnalyticsPanel';
import { FishingStatsPanel } from './features/fishingStats/FishingStatsPanel';
import { SurvivalStatsPanel } from './features/survival/survivalStatsPanel';
import { DiscordWebhookManagerModal } from './ui/Discord/DiscordWebhookManagerModal';
import { DiscordIcon } from './ui/Discord/DiscordIcon';
import { SkillStatsPanel } from './features/skills/SkillStatsPanel';
import { KillStatsPanel } from './features/kills/killsStatsPanel';
import { COLORS } from './ui/helpers/colors';
import { AnimalStatsPanel } from './features/animals/animalStatsPanel';
import './index.css';

function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [discordManagerOpen, setDiscordManagerOpen] = useState(false);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const SQL = await initSqlJs({ locateFile: (file: string) => `https://sql.js.org/dist/${file}` });
      const arrayBuffer = await file.arrayBuffer();
      const db = new SQL.Database(new Uint8Array(arrayBuffer));
      setDb(db);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError('Failed to load database: ' + e.message);
      } else {
        setError('Failed to load database: ' + String(e));
      }
      setDb(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        minWidth: 0,
        height: 64,
        background: COLORS.elevation2,
        color: COLORS.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px 0 2rem',
        zIndex: 1000,
        boxShadow: COLORS.shadow,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0, marginRight: 10 }}>
          <img src="/src/ui/assets/logo.svg" alt="ScumDB Web Analyzer Logo" style={{ width: 40, height: 40 }} />
          <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ScumDB Web Analyzer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <a
            href="https://www.buymeacoffee.com/Agent772"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginRight: 12 }}
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              style={{ height: 40, width: 143, display: 'block' }}
            />
          </a>
          <a
            href="https://github.com/Agent772/ScumDBWebAnalyser"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5em',
              background: 'transparent',
              color: COLORS.text,
              border: '2px solid #ffffff',
              borderRadius: 8,
              padding: '0.45em 1.1em',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: COLORS.shadow,
              transition: 'background 0.2s, border 0.2s',
              cursor: 'pointer',
              minWidth: 0,
              marginRight: '60px',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.41-1.07-1-1.36-1-1.36-.82-.57.06-.56.06-.56.91.07 1.39.95 1.39.95.81 1.42 2.13 1.01 2.65.77.08-.6.32-1.01.58-1.24-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 7.43c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.33.29.62.86.62 1.74 0 1.26-.01 2.28-.01 2.59 0 .27.18.58.69.48C19.13 20.54 22 16.74 22 12.26 22 6.58 17.52 2 12 2Z" fill="#ffffff"/>
            </svg>
            GitHub
          </a>
        </div>
      </header>

      {/* Main content area */}
      <main style={{
        flex: 1,
        marginBottom: 56,
        display: 'flex',
        flexDirection: 'row',
        width: '99vw',//'100%',
        height: '100%',
        boxSizing: 'border-box',
        // background: COLORS.background,
      }}>
        {/* Left navigation menu, only after DB upload */}
        {db ? (
          <nav style={{
            width: 240,
            minWidth: 180,
            maxWidth: 320,
            background: COLORS.elevation1,
            color: COLORS.text,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 'calc(100vh - 100px)',
            position: 'fixed',
            top: 64,
            left: 0,
            borderRight: '2px solid #222',
            boxShadow: COLORS.shadow,
            zIndex: 900,
          }}>
            {/* Top: Discord Webhook Manager button and Predefined analysis buttons */}
            <div style={{ padding: '1.2rem 1rem 0.5rem 1rem' }}>
              <button
                style={{
                  width: '100%',
                  marginBottom: 16,
                  padding: '0.6em',
                  borderRadius: 6,
                  border: '2px solid #7289da',
                  background: 'transparent',
                  color: '#7289da',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.2s, border 0.2s, color 0.2s',
                }}
                onClick={() => setDiscordManagerOpen(true)}
                title="Manage Discord Webhooks"
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = '#232533'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#7289da'; }}
              >
                <DiscordIcon width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Manage Webhooks
              </button>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 12 }}>Analysis</div>
              <button
                style={{ width: '100%', marginBottom: 10, padding: '0.6em', borderRadius: 6, border: 'none', background: COLORS.primary, color: COLORS.textSecondary, fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setSelectedAnalysis('squad-vehicles')}
              >
                Vehicles per Squad
              </button>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 12 }}>Stats</div>
              <button
                style={{ width: '100%', marginBottom: 10, padding: '0.6em', borderRadius: 6, border: 'none', background: COLORS.primary, color: COLORS.textSecondary, fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setSelectedAnalysis('demographics')}
              >
                Demographics
              </button>
              <button
                style={{ width: '100%', marginBottom: 10, padding: '0.6em', borderRadius: 6, border: 'none', background: COLORS.primary, color: COLORS.textSecondary, fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setSelectedAnalysis('fishing-stats')}
              >
                Fishing
              </button>
              <button
                style={{ width: '100%', marginBottom: 10, padding: '0.6em', borderRadius: 6, border: 'none', background: COLORS.primary, color: COLORS.textSecondary, fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setSelectedAnalysis('skill-stats')}
              >
                Skill
              </button>
              <button
                style={{ width: '100%', marginBottom: 10, padding: '0.6em', borderRadius: 6, border: 'none', background: COLORS.primary, color: COLORS.textSecondary, fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setSelectedAnalysis('survival-stats')}
              >
                Survival
              </button>
              <button
                style={{ width: '100%', marginBottom: 10, padding: '0.6em', borderRadius: 6, border: 'none', background: COLORS.primary, color: COLORS.textSecondary, fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setSelectedAnalysis('kills-stats')}
              >
                Kills
              </button>
              <button
                style={{ width: '100%', marginBottom: 10, padding: '0.6em', borderRadius: 6, border: 'none', background: COLORS.primary, color: COLORS.textSecondary, fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setSelectedAnalysis('animal-stats')}
              >
                Animal
              </button>
            </div>
          </nav>
        ) : null}
      {/* Discord Webhook Manager Modal (standalone, no analysis context) */}
      {discordManagerOpen && (
        <DiscordWebhookManagerModal open={discordManagerOpen} onClose={() => setDiscordManagerOpen(false)} />
      )}

        {/* Main content area */}
        <section style={{
          flex: 1,
          marginLeft: db ? 240 : 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: db ? 'flex-start' : 'center',
          padding: db ? '4.5rem 2rem 0rem 2rem' : '0',
          minHeight: 0,
          width: '100%',
          overflowY: 'auto',
        }}>
          {/* Upload UI if no DB loaded */}
          {!db && (
            <>
              <input
                id="scumdb-upload"
                type="file"
                accept=".db"
                style={{ display: 'none' }}
                onChange={handleFile}
              />
              <button
                type="button"
                onClick={() => document.getElementById('scumdb-upload')?.click()}
                style={{ padding: '0.7em 1.5em', fontSize: '1rem', borderRadius: '6px', background: COLORS.primary, color: COLORS.textSecondary, border: 'none', cursor: 'pointer', fontWeight: 600, margin: '2.5rem 0 1.5rem 0' }}
              >
                Upload SCUM.db
              </button>
              <p style={{ fontSize: 13, color: COLORS.text, marginTop: 4 }}>
                <b>Hint:</b> The <code>SCUM.db</code> file is usually located at <code>/Saved/SaveFiles/SCUM.db</code> on your server.
              </p>
              {loading && <p>Loading database...</p>}
              {error && <p style={{ color: COLORS.error }}>{error}</p>}
            </>
          )}
          {/* Show analysis result or prompt */}
          {db && (
            <div style={{ width: '100%' }}>
              {selectedAnalysis === 'demographics' && (
                <div style={{ width: '100%', minHeight: 120 }}>
                  <DemographicsAnalyticsPanel db={db} />
                </div>
              )}
              {selectedAnalysis === 'squad-vehicles' && (
                <div style={{ width: '100%', minHeight: 120 }}>
                  <SquadVehiclesPanel db={db} />
                </div>
              )}
              {selectedAnalysis === 'fishing-stats' && (
                <div style={{ width: '100%', minHeight: 120 }}>
                  <FishingStatsPanel db={db} />
                </div>
              )}
              {selectedAnalysis === 'skill-stats' && (
                <div style={{ width: '100%', minHeight: 120 }}>
                  <SkillStatsPanel db={db} />
                </div>
              )}
              {selectedAnalysis === 'survival-stats' && (
                <div style={{ width: '100%', minHeight: 120 }}>
                  <SurvivalStatsPanel db={db} />
                </div>
              )}
              {selectedAnalysis === 'kills-stats' && (
                <div style={{ width: '100%', minHeight: 120 }}>
                  <KillStatsPanel db={db} />
                </div>
              )}
              {selectedAnalysis === 'animal-stats' && (
                <div style={{ width: '100%', minHeight: 120 }}>
                  <AnimalStatsPanel db={db} />
                </div>
              )}
              {/* Placeholder for future analysis panels */}
              {!selectedAnalysis && (
                <div style={{ color: COLORS.text, fontSize: '1.1rem', marginTop: 40, textAlign: 'center' }}>
                  Select an analysis from the left menu to begin.
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 48,
        background: COLORS.elevation2,
        color: COLORS.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.98rem',
        zIndex: 1000,
        boxShadow: COLORS.shadow
      }}>
        <span>
          All data is processed in your browser and never transferred anywhere. This tool is fan-made and not affiliated with SCUM or Gamepires.
        </span>
      </footer>
    </div>
  );
}

export default App;

