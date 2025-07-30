import { useRef, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Database } from 'sql.js';
import { getDemographicsAnalytics } from './demographicsData';
import { KPI } from '../../ui/helpers/KPI';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
import { COLORS } from '../../ui/helpers/colors';
import { chartContainerStyle, chartHeaderStyle, xAxisStyle, yAxisStyle } from '../../ui/helpers/chartHelpers';

interface DemographicsProps {
  db: Database;
}

function GenderPieChart({ counts }: { counts: Record<'Male' | 'Female' | 'Unknown', number> }) {
  const pieData = [
    { name: 'Male', value: counts.Male },
    { name: 'Female', value: counts.Female },
  ];
  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  const RADIAN = Math.PI / 180;
  const GENDER_COLORS = ['#8ecae6', '#fbb6ce'];

  type PieLabelProps = {
    cx: number;
    cy: number;
    midAngle?: number;
    innerRadius: number;
    outerRadius: number;
    percent?: number;
    index?: number;
    name?: string;
    value?: number;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);
    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (total === 0) return <div>No data</div>;
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 180, minWidth: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {pieData.map((entry, idx) => (
              <Cell key={entry.name} fill={GENDER_COLORS[idx]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DemographicsAnalyticsPanel({ db }: DemographicsProps) {
  const data = getDemographicsAnalytics(db);
  const panelRef = useRef<HTMLDivElement>(null);
  // Calculate max for Y axis with buffer for label
  const maxAgeCount = data.ageDistribution.length > 0 ? Math.max(...data.ageDistribution.map(a => a.count)) : 0;
  const yAxisMax = maxAgeCount > 0 ? Math.ceil(maxAgeCount * 1.1) : 1;

  return (
    <SinglePanelLayout
      header="Demographics"
      panelRef={panelRef}
      exportFileName="demographics-analysis.png"
      discordFileName="demographics-analysis.png"
    >
      {/* KPIs: Players and Play Time */}
      <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 5', alignItems: 'center', justifyContent: 'center' }}>
        <KPI header="Players" value={data.playerCount} />
      </div>
      <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 5',  gap: 32, alignItems: 'center', justifyContent: 'center' }}>
        <KPI header="Avg. Play Time (min)" value={data.avgPlayTimeMinutes} />
      </div>
      {/* Gender Pie Chart */}
      <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '5 / 9', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...chartHeaderStyle }}>Gender</div>
        <GenderPieChart counts={data.genderCounts} />
      </div>
      {/* Size KPIs */}
      <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '5 / 7', gap: 32, justifyContent: 'center', alignItems: 'center' }}>
        <KPI
          header="Avg. Penis Size"
          value={data.avgPenisSize?.toFixed(2) ?? 'N/A'}
          footer={`min: ${data.minPenisSize ?? 'N/A'}, max: ${data.maxPenisSize ?? 'N/A'}`}
        />
      </div>
      <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '7 / 9', gap: 32, justifyContent: 'center', alignItems: 'center' }}>
        <KPI
          header="Avg. Breast Size"
          value={data.avgBreastSize?.toFixed(2) ?? 'N/A'}
          footer={`min: ${data.minBreastSize ?? 'N/A'}, max: ${data.maxBreastSize ?? 'N/A'}`}
        />
      </div>
      {/* Age Distribution */}
      <div style={{ ...chartContainerStyle, gridColumn: '1 / 13', gridRow: '9 / 13', marginTop: 8 }}>
        <div style={{ ...chartHeaderStyle }}>Age Distribution</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          {data.ageDistribution.length === 0 ? (
            <div style={{ color: COLORS.text}}>No data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ageDistribution} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <XAxis dataKey="age" tick={{ ...xAxisStyle }} axisLine={false} tickLine={false} />
                <YAxis
                  allowDecimals={false}
                  tick={{ ...yAxisStyle }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                  domain={[0, yAxisMax]}
                />
                <Bar
                  dataKey="count"
                  fill={COLORS.primary}
                  radius={[3, 3, 0, 0]}
                  label={{ position: 'top', fill: COLORS.text, fontSize: 12 }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </SinglePanelLayout>
  );
}
