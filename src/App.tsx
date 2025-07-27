

import { useState } from 'react';
import initSqlJs, { Database } from 'sql.js';
import './App.css';
import { SquadVehicles } from './analysis/Squad-vehicles';

function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

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
      // Get table names
      const res = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
      const tableNames = res[0]?.values.map((row: unknown[]) => String(row[0])) || [];
      setTables(tableNames);
    } catch (e: any) {
      setError('Failed to load database: ' + (e.message || e.toString()));
      setDb(null);
      setTables([]);
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
        background: '#2d3142',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px 0 2rem',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0, marginRight: 10 }}>
          <img src="/src/logo.svg" alt="ScumDB Web Analyzer Logo" style={{ width: 40, height: 40 }} />
          <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ScumDB Web Analyzer</span>
        </div>
        <a
          href="https://github.com/Agent772/ScumDBWebAnalyser"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5em',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            border: '2px solid #f7b801',
            borderRadius: 8,
            padding: '0.45em 1.1em',
            fontWeight: 600,
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'background 0.2s, border 0.2s',
            cursor: 'pointer',
            minWidth: 0,
            marginRight: '60px',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.41-1.07-1-1.36-1-1.36-.82-.57.06-.56.06-.56.91.07 1.39.95 1.39.95.81 1.42 2.13 1.01 2.65.77.08-.6.32-1.01.58-1.24-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 7.43c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.33.29.62.86.62 1.74 0 1.26-.01 2.28-.01 2.59 0 .27.18.58.69.48C19.13 20.54 22 16.74 22 12.26 22 6.58 17.52 2 12 2Z" fill="#f7b801"/>
          </svg>
          GitHub
        </a>
      </header>

      {/* Main content area */}
      <main style={{
        flex: 1,
        marginTop: 72,
        marginBottom: 56,
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        background: 'transparent',
      }}>
        {/* Left navigation menu, only after DB upload */}
        {db ? (
          <nav style={{
            width: 240,
            minWidth: 180,
            maxWidth: 320,
            background: '#232533',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 'calc(100vh - 120px)',
            position: 'fixed',
            top: 64,
            left: 0,
            borderRight: '2px solid #222',
            boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
            zIndex: 900,
          }}>
            {/* Top: Predefined analysis buttons */}
            <div style={{ padding: '1.2rem 1rem 0.5rem 1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 12 }}>Analysis</div>
              <button
                style={{ width: '100%', marginBottom: 10, padding: '0.6em', borderRadius: 6, border: 'none', background: '#f7b801', color: '#232533', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setSelectedAnalysis('squad-vehicles')}
              >
                Vehicles per Squad
              </button>
              <button
                style={{ width: '100%', marginBottom: 10, padding: '0.6em', borderRadius: 6, border: 'none', background: '#f7b801', color: '#232533', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setSelectedAnalysis('analysis2')}
              >
                Predefined Analysis 2
              </button>
            </div>
            {/* Bottom: SQL worksheets (placeholder) and table list */}
            <div style={{ padding: '0.5rem 1rem 1.2rem 1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 8 }}>SQL Worksheets</div>
              <div style={{ fontSize: '0.95rem', color: '#bbb', marginBottom: 12 }}>(coming soon)</div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 8 }}>Tables</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 120, overflowY: 'auto' }}>
                {tables.map((name) => (
                  <li key={name} style={{ padding: '2px 0', color: '#f7b801' }}>{name}</li>
                ))}
              </ul>
            </div>
          </nav>
        ) : null}

        {/* Main content area */}
        <section style={{
          flex: 1,
          marginLeft: db ? 240 : 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: db ? 'flex-start' : 'center',
          padding: db ? '2.5rem 2rem 1.5rem 2rem' : '0',
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
                style={{ padding: '0.7em 1.5em', fontSize: '1rem', borderRadius: '6px', background: '#f7b801', color: '#2d3142', border: 'none', cursor: 'pointer', fontWeight: 600, margin: '2.5rem 0 1.5rem 0' }}
              >
                Upload SCUM.db
              </button>
              {loading && <p>Loading database...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </>
          )}
          {/* Show analysis result or prompt */}
          {db && (
            <div style={{ width: '100%', maxWidth: 700 }}>
              {selectedAnalysis === 'squad-vehicles' && (
                <div style={{ background: '#232533', color: '#fff', borderRadius: 8, padding: '2rem', minHeight: 120 }}>
                  <SquadVehicles db={db} />
                </div>
              )}
              {selectedAnalysis === 'analysis2' && (
                <div style={{ background: '#232533', color: '#fff', borderRadius: 8, padding: '2rem', minHeight: 120 }}>
                  <h2 style={{ color: '#f7b801' }}>Predefined Analysis 2</h2>
                  <div>Analysis 2 output will appear here.</div>
                </div>
              )}
              {!selectedAnalysis && (
                <div style={{ color: '#bbb', fontSize: '1.1rem', marginTop: 40, textAlign: 'center' }}>
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
        background: '#2d3142',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.98rem',
        zIndex: 1000,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.07)'
      }}>
        <span>
          All data is processed in your browser and never transferred anywhere. This tool is fan-made and not affiliated with SCUM or Gamepires.
        </span>
      </footer>
    </div>
  );
}

export default App;

