
import { MultiPanelLayout } from '../shared/MultiPanelLayout';
import { getSkillStatsAnalytics } from './skillsData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Database } from 'sql.js';
import { getKpiBarColor } from '../../utils/kpiColor';
import { COLORS } from '../../ui/helpers/colors';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { StatsTooltip } from '../../ui/helpers/Tooltip';
import { chartContainerStyle, chartHeaderStyle, xAxisStyle, yAxisStyle, getXAxisMax } from '../../ui/helpers/chartHelpers';
import { useRef } from 'react';

interface SkillStatsPanelProps {
  db: Database;
}


export function SkillStatsPanel({ db }: SkillStatsPanelProps) {
    const data = getSkillStatsAnalytics(db);
    // panelRef must be RefObject<HTMLDivElement> (not HTMLDivElement|null)
    const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
//   const analytics = getSkillStatsAnalytics(db);
//   const { strength, constitution, dexterity, intelligence, playTimeMin, playTimeMax } = analytics;


  return (
    <MultiPanelLayout
      groupCount={1}
      getPanelHeader={() => 'Skill Leaderboards'}
      getPanelFileName={() => 'skills-leaderboards.png'}
    >
      {() => (
        <>
          <ColorLegendPanel min={data.playTimeMin} max={data.playTimeMax} label='Time Played (m)' />
          {/* Strength Chart */}
          <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
            <div style={{ ...chartHeaderStyle }}>Strength</div>
            <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.strength}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                >
                  <YAxis type="category" dataKey="name" tick={{ ...yAxisStyle }} axisLine={false} tickLine={false} width={90} />
                  <XAxis type="number" allowDecimals={false} tick={{ ...xAxisStyle }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.strength, 'value')]} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]} label={{ position: 'right' }}>
                    {data.strength.map((entry, idx) => (
                      <Cell key={`cell-strength-${idx}`} fill={getKpiBarColor(entry.play_time, data.playTimeMin, data.playTimeMax)} />
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
                                kpi={d.value} 
                                kpiLabel="Strength"
                                colorKPI={d.play_time}
                                coloringLabel="Time Played (m)"
                            />
                            );
                        }}
                    />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Constitution Chart */}
          <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
            <div style={{ ...chartHeaderStyle }}>Constitution</div>
            <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.constitution}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                >
                  <YAxis type="category" dataKey="name" tick={{ ...yAxisStyle }} axisLine={false} tickLine={false} width={90} />
                  <XAxis type="number" allowDecimals={false} tick={{ ...xAxisStyle }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.constitution, 'value')]}/>
                  <Bar dataKey="value" radius={[0, 3, 3, 0]} label={{ position: 'right' }}>
                    {data.constitution.map((entry, idx) => (
                      <Cell key={`cell-constitution-${idx}`} fill={getKpiBarColor(entry.play_time, data.playTimeMin, data.playTimeMax)} />
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
                                kpi={d.value} 
                                kpiLabel="Constitution"
                                colorKPI={d.play_time}
                                coloringLabel="Time Played (m)"
                            />
                            );
                        }}
                    />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dexterity Chart */}
          <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
            <div style={{ ...chartHeaderStyle }}>Dexterity</div>
            <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.dexterity}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                >
                  <YAxis type="category" dataKey="name" tick={{ ...yAxisStyle }} axisLine={false} tickLine={false} width={90} />
                  <XAxis type="number" allowDecimals={false} tick={{ ...xAxisStyle }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.dexterity, 'value')]}/>
                  <Bar dataKey="value" radius={[0, 3, 3, 0]} label={{ position: 'right' }}>
                    {data.dexterity.map((entry, idx) => (
                      <Cell key={`cell-dexterity-${idx}`} fill={getKpiBarColor(entry.play_time, data.playTimeMin, data.playTimeMax)} />
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
                                kpi={d.value} 
                                kpiLabel="Dexterity"
                                colorKPI={d.play_time}
                                coloringLabel="Time Played (m)"
                            />
                            );
                        }}
                    />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Intelligence Chart */}
          <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
            <div style={{ ...chartHeaderStyle }}>Intelligence</div>
            <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.intelligence}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                >
                  <YAxis type="category" dataKey="name" tick={{ ...yAxisStyle }} axisLine={false} tickLine={false} width={90} />
                  <XAxis type="number" allowDecimals={false} tick={{ ...xAxisStyle }} axisLine={false} tickLine={false} domain={[0, getXAxisMax(data.intelligence, 'value')]}/>
                  <Bar dataKey="value" radius={[0, 3, 3, 0]} label={{ position: 'right' }}>
                    {data.intelligence.map((entry, idx) => (
                      <Cell key={`cell-intelligence-${idx}`} fill={getKpiBarColor(entry.play_time, data.playTimeMin, data.playTimeMax)} />
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
                                kpi={d.value} 
                                kpiLabel="Intelligence"
                                colorKPI={d.play_time}
                                coloringLabel="Time Played (m)"
                            />
                            );
                        }}
                    />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </MultiPanelLayout>
  );
}
