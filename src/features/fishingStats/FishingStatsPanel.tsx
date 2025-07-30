import { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Database } from 'sql.js';
import { getFishingStatsAnalytics } from './fishingStatsData';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
//import { COLORS } from '../../ui/helpers/colors';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import {getKpiBarColor} from '../../utils/kpiColor';
import { StatsTooltip } from '../../ui/helpers/Tooltip';
import { chartContainerStyle, chartHeaderStyle, yAxisStyle, xAxisStyle, getXAxisMax } from '../../ui/helpers/chartHelpers';

interface FishingStatsPanelProps {
  db: Database;
}

export function FishingStatsPanel({ db }: FishingStatsPanelProps) {
  const data = getFishingStatsAnalytics(db);
  // panelRef must be RefObject<HTMLDivElement> (not HTMLDivElement|null)
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

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
    <SinglePanelLayout
      header="Fishing Stats"
      panelRef={panelRef}
      className="fishing-stats-panel"
      exportFileName="fishing-stats-analysis.png"
      discordFileName="fishing-stats-analysis.png"
    >
      {/* Fish Caught KPI Color Legend (remove this line to hide legend) */}
      <ColorLegendPanel
        min={minFishCaught}
        max={maxFishCaught}
        label="Fish Caught Color Scale"
      />
      {/* Bar Chart 1: Most Fish Caught (Vertical) */}
      <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8'}}>
        <div style={{ ...chartHeaderStyle}}>Most Fish Caught</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.mostFishCaught}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <YAxis type="category" dataKey="name" tick={{ ...yAxisStyle }} axisLine={false} tickLine={false} width={90} />
              <XAxis type="number" allowDecimals={false} tick={{ ...xAxisStyle }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.mostFishCaught, 'count')]} />
              <Bar
                dataKey="count"
                radius={[0, 3, 3, 0]}
                label={{ position: 'right' }}
              >
                {data.mostFishCaught.map((entry, idx) => (
                  <Cell key={`cell-mfc-${idx}`} fill={getKpiBarColor(entry.fishCaughtCount, minFishCaught, maxFishCaught)} />
                ))}
              </Bar>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <StatsTooltip
                        active={active}
                        name={d.name}
                        kpi={d.fishCaughtCount} 
                        kpiLabel="Fish caught"
                      />
                    );
                  }}
                />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bar Chart 2: Heaviest Fish Caught (Vertical) */}
      <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
        <div style={{ ...chartHeaderStyle }}>Heaviest Fish Caught</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.heaviestFish}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <YAxis type="category" dataKey="name" tick={{ ...yAxisStyle }} axisLine={false} tickLine={false} width={90} />
              <XAxis type="number" allowDecimals={false} tick={{ ...xAxisStyle }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.heaviestFish, 'weight')]} />
              <Bar
                dataKey="weight"
                radius={[0, 3, 3, 0]}
                label={{ position: 'right' }}
              >
                {data.heaviestFish.map((entry, idx) => (
                  <Cell key={`cell-hf-${idx}`} fill={getKpiBarColor(entry.fishCaughtCount, minFishCaught, maxFishCaught)} />
                ))}
              </Bar>
              <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <StatsTooltip
                        active={active}
                        name={d.name}
                        kpi={d.weight} 
                        kpiLabel="Weight (kg)"
                        colorKPI={d.fishCaughtCount}
                        coloringLabel="Fish caught"
                      />
                    );
                  }}
                />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bar Chart 3: Longest Fish Caught (Vertical) */}
      <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
        <div style={{ ...chartHeaderStyle }}>Longest Fish Caught</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.longestFish}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <YAxis type="category" dataKey="name" tick={{ ...yAxisStyle }} axisLine={false} tickLine={false} width={90} />
              <XAxis type="number" allowDecimals={false} tick={{ ...xAxisStyle }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.longestFish, 'length')]} />
              <Bar
                dataKey="length"
                radius={[0, 3, 3, 0]}
                label={{ position: 'right' }}
              >
                {data.longestFish.map((entry, idx) => (
                  <Cell key={`cell-lf-${idx}`} fill={getKpiBarColor(entry.fishCaughtCount, minFishCaught, maxFishCaught)} />
                ))}
              </Bar>
              <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <StatsTooltip
                        active={active}
                        name={d.name}
                        kpi={d.length} 
                        kpiLabel="Length (cm)"
                        colorKPI={d.fishCaughtCount}
                        coloringLabel="Fish caught"
                      />
                    );
                  }}
                />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bar Chart 4: Most Broken Fishing Lines (Vertical) */}
      <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
        <div style={{ ...chartHeaderStyle }}>Most Broken Fishing Lines</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.mostLinesBroken}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <YAxis type="category" dataKey="name" tick={{ ...yAxisStyle }} axisLine={false} tickLine={false} width={90} />
              <XAxis type="number" allowDecimals={false} tick={{ ...xAxisStyle }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.mostLinesBroken, 'count')]} />
              <Bar
                dataKey="count"
                radius={[0, 3, 3, 0]}
                label={{ position: 'right' }}
              >
                {data.mostLinesBroken.map((entry, idx) => (
                  <Cell key={`cell-mlb-${idx}`} fill={getKpiBarColor(entry.fishCaughtCount, minFishCaught, maxFishCaught)} />
                ))}
              </Bar>
              <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <StatsTooltip
                        active={active}
                        name={d.name}
                        kpi={d.count} 
                        kpiLabel="Snapped lines"
                        colorKPI={d.fishCaughtCount}
                        coloringLabel="Fish caught"
                      />
                    );
                  }}
                />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SinglePanelLayout>
  );
}
