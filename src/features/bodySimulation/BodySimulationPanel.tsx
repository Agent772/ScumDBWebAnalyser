
import { useEffect, useRef, useState } from 'react';
import type { Database } from 'sql.js';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
import { extractBodySimulation } from './bodySimulationData';

interface BodySimulationPanelProps {
  db: Database;
}

export function BodySimulationPanel({ db }: BodySimulationPanelProps) {
  const [data, setData] = useState<ReturnType<typeof extractBodySimulation> | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    try {
      // @ts-expect-error: sql.js typings may not match runtime
      const stmt = db.prepare(`
        SELECT up.name, p.body_simulation
        FROM user_profile up
        JOIN prisoner p ON up.id = p.user_profile_id
        WHERE p.body_simulation IS NOT NULL
        LIMIT 1
      `);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        const profile = {
          name: row['name'] as string,
          prisoner_user_profile_prisoner_idToprisoner: {
            body_simulation: row['body_simulation'] as Uint8Array | null,
          },
        };
        setData(extractBodySimulation(profile));
        setStatus(null);
      } else {
        setData(null);
        setStatus('No body simulation data found in the database.');
      }
      stmt.free();
    } catch {
      setData(null);
      setStatus('Error querying body simulation data.');
    }
  }, [db]);

  return (
    <SinglePanelLayout
      header={
        <span>
          Body Simulation Data
          {data?.name ? ` for ${data.name}` : ''}
        </span>
      }
      panelRef={panelRef}
      status={status}
    >
      <div style={{ gridColumn: '1 / 13', gridRow: '2 / 13', overflow: 'auto' }}>
        {data ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#181818', color: '#fff' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #333' }}>Attribute</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #333' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.bodySimulation).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ padding: 8, borderBottom: '1px solid #222' }}>{key}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #222' }}>{Array.isArray(value) ? value.join(', ') : value?.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: '#aaa', padding: 16 }}>No data loaded.</div>
        )}
        {data?.warnings?.length ? (
          <div style={{ color: '#f04747', marginTop: 16 }}>
            <b>Warnings:</b>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {data.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        ) : null}
      </div>
    </SinglePanelLayout>
  );
}
