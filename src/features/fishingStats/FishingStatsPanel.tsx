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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      header={t('fishing_panel.panel_header')}
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
          label={t('fishing_panel.fish_caught_color_scale')}
        />
        {/* Most Fish Caught */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8'}}>
          <div style={{ ...chartHeaderStyle}}>{t('fishing_panel.most_fish_caught')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={caughtData}
              kpiLabel={t('fishing_panel.fish_caught')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Heaviest Fish Caught */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
          <div style={{ ...chartHeaderStyle }}>{t('fishing_panel.heaviest_fish_caught')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={heaviestData}
              kpiLabel={t('fishing_panel.heaviest_fish_caught')}
              yAxisWidth={120}
              coloringLabel={t('fishing_panel.fish_caught')}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Longest Fish Caught */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>{t('fishing_panel.longest_fish_caught')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={longestData}
              kpiLabel={t('fishing_panel.longest_fish_caught')}
              yAxisWidth={120}
              coloringLabel={t('fishing_panel.fish_caught')}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Most Broken Fishing Lines */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>{t('fishing_panel.most_broken_fishing_lines')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={linesBrokenData}
              kpiLabel={t('fishing_panel.lines_broken')}
              yAxisWidth={120}
              coloringLabel={t('fishing_panel.fish_caught')}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
      </>}
    </SinglePanelLayout>
  );
}
