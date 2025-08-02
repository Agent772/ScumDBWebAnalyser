

import { MultiPanelLayout } from '../shared/MultiPanelLayout';
import { fetchAllAnimalsStats } from './animalsData';
import { Database } from 'sql.js';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle } from '../../ui/helpers/chartHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';
import { toChartData } from '../../utils/chartDataHelpers';


interface AnimalStatsPanelProps {
  db: Database;
}


export function AnimalStatsPanel({ db }: AnimalStatsPanelProps) {
  const allStats = fetchAllAnimalsStats(db);
  // Panel 1 (Animals Overview) Data Preparation
  const animalsKilledData = toChartData(allStats.MostAnimalsKilled);
  const longestAnimalKillDistanceData = toChartData(allStats.MostLongestAnimalKillDistance);
  const animalsSkinnedData = toChartData(allStats.MostAnimalsSkinned);
  const timesMauledByBearData = toChartData(allStats.MostTimesMauledByBear);

  // Panel 2 (Single Animal Kills 1) Data Preparation
  const crowsKilledData = toChartData(allStats.MostCrowsKilled);
  const seagullsKilledData = toChartData(allStats.MostSeagullsKilled);
  const horsesKilledData = toChartData(allStats.MostHorsesKilled);
  const boarsKilledData = toChartData(allStats.MostBoarsKilled);
  const goatsKilledData = toChartData(allStats.MostGoatsKilled);

  // Panel 3 (Single Animal Kills 2) Data Preparation
  const deersKilledData = toChartData(allStats.MostDeersKilled);
  const chickensKilledData = toChartData(allStats.MostChickensKilled);
  const rabbitsKilledData = toChartData(allStats.MostRabbitsKilled);
  const donkeysKilledData = toChartData(allStats.MostDonkeysKilled);
  const wolvesKilledData = toChartData(allStats.MostWolvesKilled);

  return (
    <MultiPanelLayout
      groupCount={3}
      getPanelHeader={i => {
        if (i === 0) return 'Animals Overview';
        if (i === 1) return 'Single Animal Kills 1';
        if (i === 2) return 'Single Animal Kills 2';
        return '';
      }}
      getPanelFileName={i => {
        if (i === 0) return 'animals-overview.png';
        if (i === 1) return 'single-animal-kills-1.png';
        if (i === 2) return 'single-animal-kills-2.png';
        return '';
      }}
    >
      {(groupIndex, { disableAnimation }) => {
        if (groupIndex === 0) {
          return (
            <>
              <ColorLegendPanel idSuffix={String(groupIndex)} min={animalsKilledData.colorCodingMin!} max={animalsKilledData.colorCodingMax!} label='Time Played (m)' />
              {/* Animals Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Animals Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={animalsKilledData}
                    kpiLabel="Animals Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Longest Animal Kill Distance */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Longest Animal Kill Distance</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={longestAnimalKillDistanceData}
                    kpiLabel="Longest Kill Distance"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Animals Skinned */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Animals Skinned</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={animalsSkinnedData}
                    kpiLabel="Animals Skinned"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Times Mauled By Bear */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Times Mauled By Bear</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={timesMauledByBearData}
                    kpiLabel="Times Mauled By Bear"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
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
              {/* Crows Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Crows Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={crowsKilledData}
                    kpiLabel="Crows Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Seagulls Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Seagulls Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={seagullsKilledData}
                    kpiLabel="Seagulls Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Horses Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Horses Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={horsesKilledData}
                    kpiLabel="Horses Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Boars Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Boars Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={boarsKilledData}
                    kpiLabel="Boars Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Goats Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Goats Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={goatsKilledData}
                    kpiLabel="Goats Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              <div
                style={{
                  ...chartContainerStyle,
                  gridColumn: '7 / 13',
                  gridRow: '10 / 14',
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ColorLegendPanel
                  idSuffix={String(groupIndex)}
                  min={crowsKilledData.colorCodingMin!}
                  max={crowsKilledData.colorCodingMax!}
                  label="Time Played (m)"
                />
              </div>
            </>
          );
        }
        if (groupIndex === 2) {
          return (
            <>
              {/* Deers Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Deers Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={deersKilledData}
                    kpiLabel="Deers Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Chickens Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Chickens Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={chickensKilledData}
                    kpiLabel="Chickens Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Rabbits Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Rabbits Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={rabbitsKilledData}
                    kpiLabel="Rabbits Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Donkeys Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Donkeys Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={donkeysKilledData}
                    kpiLabel="Donkeys Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Wolves Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Wolves Killed</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={wolvesKilledData}
                    kpiLabel="Wolves Killed"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              <div
                style={{
                  ...chartContainerStyle,
                  gridColumn: '7 / 13',
                  gridRow: '10 / 14',
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ColorLegendPanel
                  idSuffix={String(groupIndex)}
                  min={wolvesKilledData.colorCodingMin!}
                  max={wolvesKilledData.colorCodingMax!}
                  label="Time Played (m)"
                />
              </div>
            </>
          );
        }
      }}
    </MultiPanelLayout>
  );
}
