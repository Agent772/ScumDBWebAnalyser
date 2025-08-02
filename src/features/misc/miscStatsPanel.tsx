/**
 * Renders a panel displaying various miscellaneous statistics using bar charts.
 * 
 * This panel includes charts for:
 * - Highest Fat (kg)
 * - Highest Muscle Mass (kg)
 * - Foliage Cut
 * - Heart Attacks
 * - Overdose
 * 
 * Each chart visualizes leaderboard data, color-coded by "Time Played (m)".
 * A color legend and chart footer are also included for context.
 *
 * @param {MiscStatsPanelProps} props - The props for the panel.
 * @param {Database} props.db - The SQL.js database instance used to fetch statistics.
 * @returns {JSX.Element} The rendered miscellaneous statistics panel.
 */
import { useRef } from 'react';
import { Database } from 'sql.js';
import { fetchAllMISCStats } from './miscData';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle} from '../../ui/helpers/chartHelpers';
import { toChartData } from '../../utils/chartDataHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';
import { ChartFooter } from '../../ui/helpers/chartFooter';
import { useTranslation } from 'react-i18next';

interface MiscStatsPanelProps {
  db: Database;
}


export function MiscStatsPanel({ db }: MiscStatsPanelProps) {
  const { t } = useTranslation();
  const allStats = fetchAllMISCStats(db);

  const highestFatData = toChartData(allStats.HighestFat);
  const highestMuscleMassData = toChartData(allStats.HighestMuscleMass);
  const foliageCutData = toChartData(allStats.FoliageCut);
  const heartAttacksData = toChartData(allStats.HeartAttacks);
  const overdoseData = toChartData(allStats.Overdose);

  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <SinglePanelLayout
      header={t('misc_stats.misc_stats')}
      panelRef={panelRef}
      className="misc-stats-panel"
      exportFileName="misc-stats-analysis.png"
      discordFileName="misc-stats-analysis.png"
    >
      {({ disableAnimation }) => <>
        {/* Highest Fat */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>{t('misc_stats.highest_fat')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={highestFatData}
              kpiLabel={t('misc_stats.highest_fat')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

        {/* Highest Muscle Mass */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>{t('misc_stats.highest_muscle_mass')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={highestMuscleMassData}
              kpiLabel={t('misc_stats.highest_muscle_mass')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

         {/* Foliage Cut */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>{t('misc_stats.foliage_cut')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={foliageCutData}
              kpiLabel={t('misc_stats.foliage_cut')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

        {/* Heart Attacks */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>{t('misc_stats.heart_attacks')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={heartAttacksData}
              kpiLabel={t('misc_stats.heart_attacks')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
          <ChartFooter text={t('misc_stats.heart_attacks_footer')} />
        </div>
        {/* Overdose */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>{t('misc_stats.overdose')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={overdoseData}
              kpiLabel={t('misc_stats.overdose')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

        {/* Color Legend for Play Time */}
        <div
          style={{
            ...chartContainerStyle,
            gridColumn: '7 / 13',
            gridRow: '10 / 14',
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 120,
          }}
        >
          <ColorLegendPanel
            min={overdoseData.colorCodingMin!}
            max={overdoseData.colorCodingMax!}
            label={t('time_played_m')}
          />
        </div>
      </>}
    </SinglePanelLayout>
  );
}
