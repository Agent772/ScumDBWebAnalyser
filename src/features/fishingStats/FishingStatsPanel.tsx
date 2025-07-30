import { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Database } from 'sql.js';
import { getFishingStatsAnalytics } from './fishingStatsData';
import { AnalysisPanelLayout } from '../shared/AnalysisPanelLayout';

interface FishingStatsPanelProps {
  db: Database;
}

// Color gradient legend for fish caught KPI
function FishCaughtColorLegend({ min, max }: { min: number; max: number }) {
  // Use the same color interpolation as getBarColor
  const gradientId = 'fish-caught-gradient';
  return (
    <div style={{ margin: '0 0 18px 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 13, color: '#bbb', marginBottom: 4, textAlign: 'center' }}>Fish Caught KPI Color Scale</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width="240" height="18" style={{ display: 'block', margin: '0 auto' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8ecae6" />
              <stop offset="100%" stopColor="#f7b801" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="240" height="14" rx="7" fill={`url(#${gradientId})`} />
        </svg>
        <div style={{ width: 240, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#bbb', marginTop: 2 }}>
          <span>{min.toFixed(2)}</span>
          <span>{max.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
// Custom tooltip for detailed info
function FishingStatsTooltip({ active, payload, kpiLabel }: { active?: boolean; payload?: any[]; kpiLabel: string }) {
  if (active && payload && payload.length > 0) {
    const d = payload[0].payload;
    return (
      <div style={{ background: '#222', color: '#fff', borderRadius: 6, padding: '10px 14px', boxShadow: '0 2px 8px #0002', fontSize: 13, lineHeight: 1.5 }}>
        <div><strong>Name:</strong> {d.name}</div>
        <div><strong>{kpiLabel}:</strong> {typeof d[payload[0].dataKey] === 'number' ? d[payload[0].dataKey].toFixed(2) : d[payload[0].dataKey]}</div>
        <div><strong>Fish caught:</strong> {typeof d.fishCaughtCount === 'number' ? d.fishCaughtCount.toFixed(2) : d.fishCaughtCount}</div>
      </div>
    );
  }
  return null;
}

export function FishingStatsPanel({ db }: FishingStatsPanelProps) {
  const data = getFishingStatsAnalytics(db);
  // panelRef must be RefObject<HTMLDivElement> (not HTMLDivElement|null)
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  // Helper for dynamic X axis max (type-safe)
  function getXAxisMax<T extends { [K in Key]?: number }, Key extends keyof T>(arr: T[], key: Key) {
    const max = arr.length > 0 ? Math.max(...arr.map(a => a[key] ?? 0)) : 0;
    return max > 0 ? Math.ceil(max * 1.1) : 1;
  }

  // Color scale for fishCaughtCount (KPI)
  function getBarColor(fishCaughtCount: number, min: number, max: number) {
    // Blue to orange scale
    if (max === min) return '#8ecae6';
    const t = (fishCaughtCount - min) / (max - min);
    // interpolate between #8ecae6 (blue) and #f7b801 (orange)
    const r = Math.round(142 + (247 - 142) * t);
    const g = Math.round(202 + (184 - 202) * t);
    const b = Math.round(230 + (1 - 230) * t);
    return `rgb(${r},${g},${b})`;
  }

  // Find min/max for color scale
  const allFishCaughtCounts = [
    ...data.mostFishCaught.map(d => d.fishCaughtCount),
    ...data.heaviestFish.map(d => d.fishCaughtCount),
    ...data.longestFish.map(d => d.fishCaughtCount),
    ...data.mostLinesBroken.map(d => d.fishCaughtCount),
  ];
  const minFishCaught = Math.min(...allFishCaughtCounts);
  const maxFishCaught = Math.max(...allFishCaughtCounts);

  return (
    <AnalysisPanelLayout
      header="Fishing Stats"
      panelRef={panelRef}
      className="fishing-stats-panel"
      exportFileName="fishing-stats-analysis.png"
      discordFileName="fishing-stats-analysis.png"
    >
      {/* Fish Caught KPI Color Legend (remove this line to hide legend) */}
      <FishCaughtColorLegend min={minFishCaught} max={maxFishCaught} />
      {/* Bar Chart 1: Most Fish Caught (Vertical) */}
      <div style={{ gridColumn: '1 / 7', gridRow: '2 / 8', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch', minWidth: 0, minHeight: 220, height: '100%', width: '100%' }}>
        <div style={{ fontWeight: 600, margin: '12px 16px 8px 16px' }}>Most Fish Caught</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.mostFishCaught}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} width={90} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.mostFishCaught, 'count')]} />
              <Bar
                dataKey="count"
                radius={[0, 3, 3, 0]}
                label={{ position: 'right' }}
              >
                {data.mostFishCaught.map((entry, idx) => (
                  <Cell key={`cell-mfc-${idx}`} fill={getBarColor(entry.fishCaughtCount, minFishCaught, maxFishCaught)} />
                ))}
              </Bar>
              <Tooltip content={<FishingStatsTooltip kpiLabel="Fish caught" />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bar Chart 2: Heaviest Fish Caught (Vertical) */}
      <div style={{ gridColumn: '7 / 13', gridRow: '2 / 8', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch', minWidth: 0, minHeight: 220, height: '100%', width: '100%' }}>
        <div style={{ fontWeight: 600, margin: '12px 16px 8px 16px' }}>Heaviest Fish Caught</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.heaviestFish}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} width={90} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.heaviestFish, 'weight')]} />
              <Bar
                dataKey="weight"
                radius={[0, 3, 3, 0]}
                label={{ position: 'right' }}
              >
                {data.heaviestFish.map((entry, idx) => (
                  <Cell key={`cell-hf-${idx}`} fill={getBarColor(entry.fishCaughtCount, minFishCaught, maxFishCaught)} />
                ))}
              </Bar>
              <Tooltip content={<FishingStatsTooltip kpiLabel="Heaviest (kg)" />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bar Chart 3: Longest Fish Caught (Vertical) */}
      <div style={{ gridColumn: '1 / 7', gridRow: '8 / 14', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch', minWidth: 0, minHeight: 220, height: '100%', width: '100%' }}>
        <div style={{ fontWeight: 600, margin: '12px 16px 8px 16px' }}>Longest Fish Caught</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.longestFish}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} width={90} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.longestFish, 'length')]} />
              <Bar
                dataKey="length"
                radius={[0, 3, 3, 0]}
                label={{ position: 'right' }}
              >
                {data.longestFish.map((entry, idx) => (
                  <Cell key={`cell-lf-${idx}`} fill={getBarColor(entry.fishCaughtCount, minFishCaught, maxFishCaught)} />
                ))}
              </Bar>
              <Tooltip content={<FishingStatsTooltip kpiLabel="Longest (cm)" />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bar Chart 4: Most Broken Fishing Lines (Vertical) */}
      <div style={{ gridColumn: '7 / 13', gridRow: '8 / 14', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch', minWidth: 0, minHeight: 220, height: '100%', width: '100%' }}>
        <div style={{ fontWeight: 600, margin: '12px 16px 8px 16px' }}>Most Broken Fishing Lines</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.mostLinesBroken}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} width={90} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#bbb' }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.mostLinesBroken, 'count')]} />
              <Bar
                dataKey="count"
                radius={[0, 3, 3, 0]}
                label={{ position: 'right' }}
              >
                {data.mostLinesBroken.map((entry, idx) => (
                  <Cell key={`cell-mlb-${idx}`} fill={getBarColor(entry.fishCaughtCount, minFishCaught, maxFishCaught)} />
                ))}
              </Bar>
              <Tooltip content={<FishingStatsTooltip kpiLabel="Lines broken" />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnalysisPanelLayout>
  );
}
