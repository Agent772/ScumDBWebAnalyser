import { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Database } from 'sql.js';
import { getFishingStatsAnalytics } from './fishingStats';
import { exportAsImage } from '../utils/exportAsImage';
import { DiscordModal } from '../utils/DiscordModal';
import { postToDiscordWebhook } from '../utils/discordWebhook';
import { DiscordIcon } from '../assets/DiscordIcon';

interface FishingStatsPanelProps {
  db: Database;
}

export function FishingStatsPanel({ db }: FishingStatsPanelProps) {
  const data = getFishingStatsAnalytics(db);
  const panelRef = useRef<HTMLDivElement>(null);
  const [discordOpen, setDiscordOpen] = useState(false);
  const [discordStatus, setDiscordStatus] = useState<string | null>(null);

  const handleExport = async () => {
    if (panelRef.current) {
      await exportAsImage(panelRef.current, { fileName: 'fishing-stats-analysis.png' });
    }
  };

  const handleDiscordSend = async (info: any) => {
    setDiscordStatus(null);
    if (!panelRef.current) {
      setDiscordStatus('Panel not found.');
      return;
    }
    const dataUrl = await exportAsImage(panelRef.current, { returnDataUrl: true, fileName: 'fishing-stats-analysis.png' }) as string;
    if (!dataUrl) {
      setDiscordStatus('Failed to export image.');
      return;
    }
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ok = await postToDiscordWebhook(info, info.message || '', blob, 'fishing-stats-analysis.png');
    setDiscordStatus(ok ? 'Posted to Discord with image!' : 'Failed to post. Check the webhook URL and try again.');
    if (ok) setDiscordOpen(false);
  };

  // Helper for dynamic Y axis max
  function getYAxisMax(arr: { count?: number; weight?: number; length?: number }[], key: string) {
    const max = arr.length > 0 ? Math.max(...arr.map(a => a[key] ?? 0)) : 0;
    return max > 0 ? Math.ceil(max * 1.1) : 1;
  }

  // Make the grid fill all available space
  return (
    <div style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
        <button
          onClick={handleExport}
          style={{
            padding: '6px 18px',
            background: '#f7b801',
            color: '#222',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Export as Image
        </button>
        <button
          type="button"
          className="analysis-discord-btn"
          onClick={() => setDiscordOpen(true)}
        >
          <DiscordIcon width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Send to Discord
        </button>
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
      <div
        ref={panelRef}
        className="fishing-stats-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(13, auto)',
          gap: 16,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            color: '#f7b801',
            fontWeight: 700,
            fontSize: '2rem',
            margin: 0,
            textAlign: 'center',
            letterSpacing: '0.01em',
            gridColumn: '1 / 13',
            gridRow: '1 / 2',
          }}
        >
          Fishing Stats
        </h2>
        {/* Bar Chart 1: Most Fish Caught */}
        <div style={{ gridColumn: '1 / 7', gridRow: '2 / 5', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch', minWidth: 0, minHeight: 0, height: '100%', width: '100%' }}>
          <div style={{ fontWeight: 600, margin: '12px 16px 8px 16px' }}>Most Fish Caught</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.mostFishCaught} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} width={28} domain={[0, getYAxisMax(data.mostFishCaught, 'count')]} />
              <Bar dataKey="count" fill="#8ecae6" radius={[3, 3, 0, 0]} label={{ position: 'top', fill: '#bbb', fontSize: 12 }} />
              <Tooltip />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Bar Chart 2: Heaviest Fish Caught */}
        <div style={{ gridColumn: '7 / 13', gridRow: '2 / 5', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch', minWidth: 0, minHeight: 0, height: '100%', width: '100%' }}>
          <div style={{ fontWeight: 600, margin: '12px 16px 8px 16px' }}>Heaviest Fish Caught</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.heaviestFish} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} width={28} domain={[0, getYAxisMax(data.heaviestFish, 'weight')]} />
              <Bar dataKey="weight" fill="#f7b801" radius={[3, 3, 0, 0]} label={{ position: 'top', fill: '#bbb', fontSize: 12 }} />
              <Tooltip />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Bar Chart 3: Longest Fish Caught */}
        <div style={{ gridColumn: '1 / 7', gridRow: '5 / 8', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch', minWidth: 0, minHeight: 0, height: '100%', width: '100%' }}>
          <div style={{ fontWeight: 600, margin: '12px 16px 8px 16px' }}>Longest Fish Caught</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.longestFish} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} width={28} domain={[0, getYAxisMax(data.longestFish, 'length')]} />
              <Bar dataKey="length" fill="#b6e880" radius={[3, 3, 0, 0]} label={{ position: 'top', fill: '#bbb', fontSize: 12 }} />
              <Tooltip />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Bar Chart 4: Most Broken Fishing Lines */}
        <div style={{ gridColumn: '7 / 13', gridRow: '5 / 8', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch', minWidth: 0, minHeight: 0, height: '100%', width: '100%' }}>
          <div style={{ fontWeight: 600, margin: '12px 16px 8px 16px' }}>Most Broken Fishing Lines</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.mostLinesBroken} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} width={28} domain={[0, getYAxisMax(data.mostLinesBroken, 'count')]} />
              <Bar dataKey="count" fill="#fbb6ce" radius={[3, 3, 0, 0]} label={{ position: 'top', fill: '#bbb', fontSize: 12 }} />
              <Tooltip />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
