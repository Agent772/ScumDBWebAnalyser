

/**
 * Displays a multi-panel layout of animal-related statistics using leaderboard bar charts.
 * 
 * This panel is divided into three groups:
 * 
 * 1. **Animals Overview**: Shows overall stats such as animals killed, longest animal kill distance, animals skinned, and times mauled by bear.
 * 2. **Single Animal Kills 1**: Displays stats for crows, seagulls, horses, boars, and goats killed.
 * 3. **Single Animal Kills 2**: Displays stats for deers, chickens, rabbits, donkeys, and wolves killed.
 * 
 * Each chart uses a color legend based on "Time Played (m)" for additional context.
 * 
 * @param {AnimalStatsPanelProps} props - The props for the component.
 * @param {Database} props.db - The SQL.js database instance used to fetch animal statistics.
 * 
 * @returns {JSX.Element} The rendered animal statistics panel with multiple grouped charts.
 */
import { MultiPanelLayout } from '../shared/MultiPanelLayout';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        if (i === 0) return t('animals_panel.panel_header');
        if (i === 1) return t('animals_panel.single_animal_kills', { page: 1 });
        if (i === 2) return t('animals_panel.single_animal_kills', { page: 2 });
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
              <ColorLegendPanel idSuffix={String(groupIndex)} min={animalsKilledData.colorCodingMin!} max={animalsKilledData.colorCodingMax!} label={t('time_played_m')}/>
              {/* Animals Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.animals_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={animalsKilledData}
                    kpiLabel={t('animals_panel.animals_killed')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Longest Animal Kill Distance */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.longest_animal_kill_distance')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={longestAnimalKillDistanceData}
                    kpiLabel={t('animals_panel.longest_animal_kill_distance')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Animals Skinned */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.animals_skinned')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={animalsSkinnedData}
                    kpiLabel={t('animals_panel.animals_skinned')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Times Mauled By Bear */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.times_mauled_by_bear')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={timesMauledByBearData}
                    kpiLabel={t('animals_panel.times_mauled_by_bear')}
                    coloringLabel={t('time_played_m')}
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
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.crows_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={crowsKilledData}
                    kpiLabel={t('animals_panel.crows_killed')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Seagulls Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.seagulls_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={seagullsKilledData}
                    kpiLabel={t('animals_panel.seagulls_killed')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Horses Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.horses_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={horsesKilledData}
                    kpiLabel={t('animals_panel.horses_killed')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Boars Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.boars_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={boarsKilledData}
                    kpiLabel={t('animals_panel.boars_killed')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Goats Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.goats_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={goatsKilledData}
                    kpiLabel={t('animals_panel.goats_killed')}
                    coloringLabel={t('time_played_m')}
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
                  label={t('time_played_m')}
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
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.deers_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={deersKilledData}
                    kpiLabel={t('animals_panel.deers_killed')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Chickens Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.chickens_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={chickensKilledData}
                    kpiLabel={t('animals_panel.chickens_killed')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Rabbits Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.rabbits_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={rabbitsKilledData}
                    kpiLabel={t('animals_panel.rabbits_killed')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Donkeys Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.donkeys_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={donkeysKilledData}
                    kpiLabel={t('animals_panel.donkeys_killed')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Wolves Killed */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('animals_panel.wolves_killed')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={wolvesKilledData}
                    kpiLabel={t('animals_panel.wolves_killed')}
                    coloringLabel={t('time_played_m')}
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
                  label={t('time_played_m')}
                />
              </div>
            </>
          );
        }
      }}
    </MultiPanelLayout>
  );
}
