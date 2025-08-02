/**
 * Displays a panel with various fishing statistics visualizations.
 *
 * This panel includes bar charts for:
 * - Most Fish Caught
 * - Heaviest Fish Caught
 * - Longest Fish Caught
 * - Most Broken Fishing Lines
 *
 * It also displays a color legend for the "Fish Caught" KPI.
 *
 * @param {Object} props - The component props.
 * @param {Database} props.db - The SQL.js database instance used to fetch fishing statistics.
 * @returns {JSX.Element} The rendered fishing stats panel.
 */
import { useRef } from 'react';
import { Database } from 'sql.js';
import { fetchAllFishingStats } from './fishingStatsData';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle} from '../../ui/helpers/chartHelpers';
import { toChartData } from '../../utils/chartDataHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';

interface FishingStatsPanelProps {
  db: Database;
}

export function FishingStatsPanel({ db }: FishingStatsPanelProps) {
  const allStats = fetchAllFishingStats(db);
  const minFishCaught = Math.min(...allStats.Caught.map(d => d.kpi));
  const maxFishCaught = Math.max(...allStats.Caught.map(d => d.kpi));
  const caughtData = toChartData(allStats.Caught);
  const heaviestData = toChartData(allStats.Heaviest);
  const longestData = toChartData(allStats.Longest);
  const linesBrokenData = toChartData(allStats.LinesBroken);
  // panelRef must be RefObject<HTMLDivElement> (not HTMLDivElement|null)
  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <SinglePanelLayout
      header="Fishing Stats"
      panelRef={panelRef}
      className="fishing-stats-panel"
      exportFileName="fishing-stats-analysis.png"
      discordFileName="fishing-stats-analysis.png"
    >
      {({ disableAnimation }) => <>
        {/* Fish Caught KPI Color Legend */}
        <ColorLegendPanel
          min={minFishCaught}
          max={maxFishCaught}
          label="Fish Caught Color Scale"
        />
        {/* Most Fish Caught */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8'}}>
          <div style={{ ...chartHeaderStyle}}>Most Fish Caught</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={caughtData}
              kpiLabel='Fish Caught'
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Heaviest Fish Caught */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
          <div style={{ ...chartHeaderStyle }}>Heaviest Fish Caught</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={heaviestData}
              kpiLabel='Heaviest Fish Caught'
              yAxisWidth={120}
              coloringLabel="Fish Caught"
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Longest Fish Caught */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>Longest Fish Caught</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={longestData}
              kpiLabel='Longest Fish Caught'
              yAxisWidth={120}
              coloringLabel="Fish Caught"
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Most Broken Fishing Lines */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>Most Broken Fishing Lines</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={linesBrokenData}
              kpiLabel='Lines Broken'
              yAxisWidth={120}
              coloringLabel="Fish Caught"
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
      </>}
    </SinglePanelLayout>
  );
}
