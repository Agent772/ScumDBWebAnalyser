/**
 * Displays a panel with various travel statistics visualized as bar charts.
 *
 * This panel includes charts for:
 * - Distance Travelled By Foot
 * - Distance Travelled In Vehicle
 * - Distance Travelled Swimming
 * - Distance Travelled By Boat
 * - Distance Sailed
 *
 * Each chart uses a leaderboard bar chart to show the top performers, with color coding based on "Time Played (m)".
 * A color legend is also provided for the play time metric.
 *
 * @param {TravelStatsPanelProps} props - The props for the panel.
 * @param {Database} props.db - The SQL.js database instance to fetch travel stats from.
 * @returns {JSX.Element} The rendered travel stats panel.
 */
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Database } from 'sql.js';
import { fetchAllTravelStats } from './travelData';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle} from '../../ui/helpers/chartHelpers';
import { toChartData } from '../../utils/chartDataHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';

interface TravelStatsPanelProps {
  db: Database;
}

export function TravelStatsPanel({ db }: TravelStatsPanelProps) {
  const { t } = useTranslation();
  const allStats = fetchAllTravelStats(db);

  const distanceTravelledByFootData = toChartData(allStats.MostDistanceTravelledByFoot);
  const distanceTravelledInVehicleData = toChartData(allStats.MostDistanceTravelledInVehicle);
  const distanceTravelledSwimmingData = toChartData(allStats.MostDistanceTravelledSwimming);
  const distanceTravelledByBoatData = toChartData(allStats.MostDistanceTravelledByBoat);
  const distanceSailedData = toChartData(allStats.MostDistanceSailed);

  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <SinglePanelLayout
      header={t('travel_panel.panel_header')}
      panelRef={panelRef}
      className="travel-stats-panel"
      exportFileName="travel-stats-analysis.png"
      discordFileName="travel-stats-analysis.png"
    >
      {({ disableAnimation }) => <>
        {/* Distance Travelled By Foot */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>{t('travel_panel.distance_by_foot')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceTravelledByFootData}
              kpiLabel={t('travel_panel.distance_by_foot')}
              coloringLabel={t('travel_panel.time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Distance Travelled In Vehicle */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>{t('travel_panel.distance_in_vehicle')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceTravelledInVehicleData}
              kpiLabel={t('travel_panel.distance_in_vehicle')}
              coloringLabel={t('travel_panel.time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Distance Travelled Swimming */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>{t('travel_panel.distance_swimming')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceTravelledSwimmingData}
              kpiLabel={t('travel_panel.distance_swimming')}
              coloringLabel={t('travel_panel.time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Distance Travelled By Boat */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>{t('travel_panel.distance_by_boat')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceTravelledByBoatData}
              kpiLabel={t('travel_panel.distance_by_boat')}
              coloringLabel={t('travel_panel.time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Distance Sailed */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>{t('travel_panel.distance_sailed')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceSailedData}
              kpiLabel={t('travel_panel.distance_sailed')}
              coloringLabel={t('travel_panel.time_played_m')}
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
                }}
              >
                <ColorLegendPanel
                  min={distanceSailedData.colorCodingMin!}
                  max={distanceSailedData.colorCodingMax!}
                  label={t('travel_panel.time_played_m')}
                />
              </div>
      </>}
    </SinglePanelLayout>
  );
}
