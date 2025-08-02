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
  const allStats = fetchAllTravelStats(db);

  const distanceTravelledByFootData = toChartData(allStats.MostDistanceTravelledByFoot);
  const distanceTravelledInVehicleData = toChartData(allStats.MostDistanceTravelledInVehicle);
  const distanceTravelledSwimmingData = toChartData(allStats.MostDistanceTravelledSwimming);
  const distanceTravelledByBoatData = toChartData(allStats.MostDistanceTravelledByBoat);
  const distanceSailedData = toChartData(allStats.MostDistanceSailed);

  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <SinglePanelLayout
      header="Travel Stats"
      panelRef={panelRef}
      className="travel-stats-panel"
      exportFileName="travel-stats-analysis.png"
      discordFileName="travel-stats-analysis.png"
    >
      {({ disableAnimation }) => <>
        {/* Distance Travelled By Foot */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>Distance Travelled By Foot (m)</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceTravelledByFootData}
              kpiLabel='Distance By Foot (m)'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Distance Travelled In Vehicle */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>Distance Travelled In Vehicle (m)</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceTravelledInVehicleData}
              kpiLabel='Distance In Vehicle (m)'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Distance Travelled Swimming */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>Distance Travelled Swimming (m)</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceTravelledSwimmingData}
              kpiLabel='Distance Swimming (m)'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Distance Travelled By Boat */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>Distance Travelled By Boat (m)</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceTravelledByBoatData}
              kpiLabel='Distance By Boat (m)'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Distance Sailed */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>Distance Sailed (m)</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={distanceSailedData}
              kpiLabel='Distance Sailed (m)'
              coloringLabel="Time Played (m)"
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
                  label="Time Played (m)"
                />
              </div>
      </>}
    </SinglePanelLayout>
  );
}
