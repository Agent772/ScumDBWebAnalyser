import { useRef } from 'react';
import { Database } from 'sql.js';
import { fetchAllSurvivalStats } from './survivalData';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle} from '../../ui/helpers/chartHelpers';
import { toChartData } from '../../utils/chartDataHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';

interface SurvivalStatsPanelProps {
  db: Database;
}

export function SurvivalStatsPanel({ db }: SurvivalStatsPanelProps) {
  const allStats = fetchAllSurvivalStats(db);
  const fpData = toChartData(allStats.FP);
  const highestFPData = toChartData(allStats.highestFP);
  // const lowestFPData = toChartData(allStats.lowestFP);
  const survivedTimeData = toChartData(allStats.survivedTime);
  const timeDeadData = toChartData(allStats.timeDead);
  
  // panelRef must be RefObject<HTMLDivElement> (not HTMLDivElement|null)
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <SinglePanelLayout
      header="Survival Stats"
      panelRef={panelRef}
      className="survival-stats-panel"
      exportFileName="survival-stats-analysis.png"
      discordFileName="survival-stats-analysis.png"
    >
      {/* Play Time KPI Color Legend */}
      <ColorLegendPanel
        min={fpData.colorCodingMin ?? 0}
        max={fpData.colorCodingMax ?? 0}
        label="Played Time (m)"
      />
      {/* FP */}
      <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8'}}>
        <div style={{ ...chartHeaderStyle}}>Famepoints</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <LeaderboardBarChart
            data={fpData}
            kpiLabel='Famepoints'
            yAxisWidth={120}
            coloringLabel="Played Time (m)"
          />
        </div>
      </div>

      {/* Highest FP */}
      <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
        <div style={{ ...chartHeaderStyle }}>Highest Famepoints</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <LeaderboardBarChart
            data={highestFPData}
            kpiLabel='Highest Famepoints'
            yAxisWidth={120}
            coloringLabel="Played Time (m)"
          />
        </div>
      </div>

      {/* Survived Time*/}
      <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
        <div style={{ ...chartHeaderStyle }}>Survived Time (m)</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <LeaderboardBarChart
            data={survivedTimeData}
            kpiLabel='Survived Time'
            yAxisWidth={120}
            coloringLabel="Played Time (m)"
          />
        </div>
      </div>

      {/* Time Dead*/}
      <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
        <div style={{ ...chartHeaderStyle }}>Time Dead (m)</div>
        <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
          <LeaderboardBarChart
            data={timeDeadData}
            kpiLabel='Time Dead (m)'
            yAxisWidth={120}
            coloringLabel="Played Time (m)"
          />
        </div>
      </div>
    </SinglePanelLayout>
  );
}