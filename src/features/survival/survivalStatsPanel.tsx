/**
 * Renders the Survival Stats Panel, displaying various survival-related statistics
 * using bar charts grouped into two panels: "Famepoints & Time" and "Survival Stats".
 *
 * This component fetches all survival stats from the provided SQLite database,
 * prepares the data for charting, and displays them in a multi-panel layout.
 * Each panel contains several charts visualizing different KPIs, such as Famepoints,
 * Survived Time, Wounds Patched, and more, with color coding based on played time.
 *
 * @param db - The SQLite database instance from which survival stats are fetched.
 * @returns A React component displaying survival statistics in a multi-panel chart layout.
 */
import { Database } from 'sql.js';
import { fetchAllSurvivalStats } from './survivalData';
import { MultiPanelLayout } from '../shared/MultiPanelLayout';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle} from '../../ui/helpers/chartHelpers';
import { toChartData } from '../../utils/chartDataHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';
import { useTranslation } from 'react-i18next';


export function SurvivalStatsPanel({ db }: { db: Database }) {
  const { t } = useTranslation();
  const allStats = fetchAllSurvivalStats(db);
  // Panel 1 (Famepoints & Time) Data Preparation
  const fpData = toChartData(allStats.FP);
  const highestFPData = toChartData(allStats.highestFP);
  const survivedTimeData = toChartData(allStats.survivedTime);
  const timeDeadData = toChartData(allStats.timeDead);
  // Panel 2 (Survival Stats) Data Preparation
  const woundsPatchedData = toChartData(allStats.woundsPatched);
  const teethLostData = toChartData(allStats.teethLost);
  const highestDamageTakenData = toChartData(allStats.highestDamageTaken);
  const timesMauledByBearData = toChartData(allStats.timesMauledByBear);
  const timesCaughtBySharkData = toChartData(allStats.timesCaughtByShark);
  const timesEscapedSharkBiteData = toChartData(allStats.timesEscapedSharkBite);

  return (
    <MultiPanelLayout
      groupCount={2}
      getPanelHeader={i => {
        if (i === 0) return t('survival_stats.famepoints_time_header');
        if (i === 1) return t('survival_stats.survival_stats_header');
        return '';
      }}
      getPanelFileName={i => {
        if (i === 0) return 'famepoints-time.png';
        if (i === 1) return 'survival-stats.png';
        return '';
      }}
    >
      {(groupIndex, { disableAnimation }) => {
        if (groupIndex === 0) {
          return (
            <>
              <ColorLegendPanel
                idSuffix={String(groupIndex)}
                min={fpData.colorCodingMin ?? 0}
                max={fpData.colorCodingMax ?? 0}
                label={t('survival_stats.played_time')}
              />
              {/* FP */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8'}}>
                <div style={{ ...chartHeaderStyle}}>{t('survival_stats.famepoints')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={fpData}
                    kpiLabel={t('survival_stats.famepoints')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Highest FP */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('survival_stats.highest_famepoints')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={highestFPData}
                    kpiLabel={t('survival_stats.highest_famepoints')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Survived Time*/}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('survival_stats.survived_time')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={survivedTimeData}
                    kpiLabel={t('survival_stats.survived_time')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Time Dead*/}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('survival_stats.time_dead')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={timeDeadData}
                    kpiLabel={t('survival_stats.time_dead')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
            </>
          );
        }
        if (groupIndex === 1) {
          return (
            <>
              {/* Wounds Patched */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('survival_stats.wounds_patched')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={woundsPatchedData}
                    kpiLabel={t('survival_stats.wounds_patched')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Teeth Lost */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('survival_stats.teeth_lost')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={teethLostData}
                    kpiLabel={t('survival_stats.teeth_lost')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Highest Damage Taken */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('survival_stats.highest_damage_taken')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={highestDamageTakenData}
                    kpiLabel={t('survival_stats.highest_damage_taken')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Times Mauled By Bear */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('survival_stats.animals_panel.times_mauled_by_bear')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={timesMauledByBearData}
                    kpiLabel={t('survival_stats.animals_panel.times_mauled_by_bear')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Times Caught By Shark */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('survival_stats.times_caught_by_shark')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={timesCaughtBySharkData}
                    kpiLabel={t('survival_stats.times_caught_by_shark')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Times Escaped Shark Bite */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('survival_stats.times_escaped_shark_bite')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={timesEscapedSharkBiteData}
                    kpiLabel={t('survival_stats.times_escaped_shark_bite')}
                    yAxisWidth={120}
                    coloringLabel={t('survival_stats.played_time')}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
            </>
          );
        }
      }}
    </MultiPanelLayout>
  );
}