// End of file
import { Database } from 'sql.js';
import { fetchAllSurvivalStats } from './survivalData';
import { MultiPanelLayout } from '../shared/MultiPanelLayout';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle} from '../../ui/helpers/chartHelpers';
import { toChartData } from '../../utils/chartDataHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';

export function SurvivalStatsPanel({ db }: { db: Database }) {
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
        if (i === 0) return 'Famepoints & Time';
        if (i === 1) return 'Survival Stats';
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
                    disableAnimation={disableAnimation}
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
                    disableAnimation={disableAnimation}
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
                    disableAnimation={disableAnimation}
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
                <div style={{ ...chartHeaderStyle }}>Wounds Patched</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={woundsPatchedData}
                    kpiLabel='Wounds Patched'
                    yAxisWidth={120}
                    coloringLabel="Played Time (m)"
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Teeth Lost */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Teeth Lost</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={teethLostData}
                    kpiLabel='Teeth Lost'
                    yAxisWidth={120}
                    coloringLabel="Played Time (m)"
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Highest Damage Taken */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Highest Damage Taken</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={highestDamageTakenData}
                    kpiLabel='Highest Damage Taken'
                    yAxisWidth={120}
                    coloringLabel="Played Time (m)"
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Times Mauled By Bear */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Times Mauled By Bear</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={timesMauledByBearData}
                    kpiLabel='Times Mauled By Bear'
                    yAxisWidth={120}
                    coloringLabel="Played Time (m)"
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Times Caught By Shark */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Times Caught By Shark</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={timesCaughtBySharkData}
                    kpiLabel='Times Caught By Shark'
                    yAxisWidth={120}
                    coloringLabel="Played Time (m)"
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Times Escaped Shark Bite */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Times Escaped Shark Bite</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={timesEscapedSharkBiteData}
                    kpiLabel='Times Escaped Shark Bite'
                    yAxisWidth={120}
                    coloringLabel="Played Time (m)"
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