/**
 * Displays a multi-panel layout with food and body response statistics visualized as bar charts.
 *
 * This panel is divided into two groups:
 * 1. **Food & Drink Overview**: Shows charts for Food Eaten, Liquid Drank, Mushrooms Eaten, Alcohol Drank, and Total Calories Intake.
 * 2. **Body Response**: Shows charts for Urinations, Defecations, Diarrheas, Vomits, and Starvation.
 *
 * Each chart uses a leaderboard-style bar chart, color-coded by "Time Played (m)".
 * A color legend is displayed for each group to explain the color coding.
 *
 * @param {FoodStatsPanelProps} props - The component props.
 * @param {Database} props.db - The SQL.js database instance used to fetch food statistics.
 * @returns {JSX.Element} The rendered food statistics panel.
 */
import { MultiPanelLayout } from '../shared/MultiPanelLayout';
import { fetchAllFoodStats } from './foodData';
import { Database } from 'sql.js';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle } from '../../ui/helpers/chartHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';
import { toChartData } from '../../utils/chartDataHelpers';
import { useTranslation } from 'react-i18next';


interface FoodStatsPanelProps {
  db: Database;
}


export function FoodStatsPanel({ db }: FoodStatsPanelProps) {
  const { t } = useTranslation();
  const allStats = fetchAllFoodStats(db);
  // Panel 1 (Food Overview) Data Preparation
  const foodEatenData = toChartData(allStats.FoodEaten);
  const liquidDrankData = toChartData(allStats.LiquidDrank);
  const mushroomsEatenData = toChartData(allStats.MushroomsEaten);
  const alcoholDrankData = toChartData(allStats.AlcoholDrank);
  const totalCaloriesIntakeData = toChartData(allStats.TotalCaloriesIntake);

  // Panel 2 (Body Response) Data Preparation
  const urinationData = toChartData(allStats.TotalUrinations);
  const defecationData = toChartData(allStats.TotalDefecations);
  const diarrheaData = toChartData(allStats.Diarrheas);
  const vomitData = toChartData(allStats.Vomits);
  const starvationData = toChartData(allStats.Starvation);

  return (
    <MultiPanelLayout
      groupCount={2}
      getPanelHeader={i => {
        if (i === 0) return t('food_panel.panel_header');
        if (i === 1) return t('food_panel.panel_header_2');
        return '';
      }}
      getPanelFileName={i => {
        if (i === 0) return 'food-drink-overview.png';
        if (i === 1) return 'body-response.png';
        return '';
      }}
    >
      {(groupIndex, { disableAnimation }) => {
        if (groupIndex === 0) {
          return (
            <>
              {/* Food Eaten Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.food_eaten')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={foodEatenData}
                    kpiLabel={t('food_panel.food_eaten')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Liquid Drank Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.liquid_drank')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={liquidDrankData}
                    kpiLabel={t('food_panel.liquid_drank')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Mushrooms Eaten Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.mushrooms_eaten')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={mushroomsEatenData}
                    kpiLabel={t('food_panel.mushrooms_eaten')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Alcohol Drank Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.alcohol_drank')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={alcoholDrankData}
                    kpiLabel={t('food_panel.alcohol_drank')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Total Calories Intake Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.total_calories_intake')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={totalCaloriesIntakeData}
                    kpiLabel={t('food_panel.total_calories_intake')}
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
                  idSuffix={String(groupIndex)}
                  min={totalCaloriesIntakeData.colorCodingMin!}
                  max={totalCaloriesIntakeData.colorCodingMax!}
                  label={t('time_played_m')}
                />
              </div>
            </>
          );
        }
        if (groupIndex === 1) {
          return (
            <>
              {/* Urination Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.urinations')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={urinationData}
                    kpiLabel={t('food_panel.urinations')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Defecation Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.defecations')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={defecationData}
                    kpiLabel={t('food_panel.defecations')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Diarrhea Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.diarrheas')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={diarrheaData}
                    kpiLabel={t('food_panel.diarrheas')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Vomit Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.vomits')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={vomitData}
                    kpiLabel={t('food_panel.vomits')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Starvation Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('food_panel.starvation')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={starvationData}
                    kpiLabel={t('food_panel.starvation')}
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
                  idSuffix={String(groupIndex)}
                  min={starvationData.colorCodingMin!}
                  max={starvationData.colorCodingMax!}
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
