import { useRef } from 'react';
import { Database } from 'sql.js';
import { fetchAllLootingStats } from './lootingData';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle} from '../../ui/helpers/chartHelpers';
import { toChartData } from '../../utils/chartDataHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';
import { ChartFooter } from '../../ui/helpers/chartFooter';

interface LootingStatsPanelProps {
  db: Database;
}

export function LootingStatsPanel({ db }: LootingStatsPanelProps) {
  const allStats = fetchAllLootingStats(db);

  const containersLootedData = toChartData(allStats.ContainersLooted);
  const itemsPutIntoContainersData = toChartData(allStats.ItemsPutIntoContainers);
  const highestWeightCarriedData = toChartData(allStats.HighestWeightCarried);
  const locksPickedData = toChartData(allStats.LocksPicked);
  const itemsPickedUpData = toChartData(allStats.ItemsPickedUp);

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
        {/* Locks Picked */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>Locks Picked</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={locksPickedData}
              kpiLabel='Locks Picked'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

        {/* Containers Looted */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>Containers Looted</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={containersLootedData}
              kpiLabel='Containers Looted'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

         {/* Items picked up */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>Items Picked Up</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={itemsPickedUpData}
              kpiLabel='Items Picked Up'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

        {/* Items put into Containers */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>Items Put Into Containers</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={itemsPutIntoContainersData}
              kpiLabel='Items Put Into Containers'
              coloringLabel="Items Picked Up"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
          <ChartFooter text='Color coding is based on the number of items picked up.' />
        </div>
        {/* Highest Weight carried */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>Highest Weight Carried (kg)</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={highestWeightCarriedData}
              kpiLabel='Highest Weight Carried (kg)'
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
            gridRow: '10 / 12',
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 120,
          }}
        >
          <ColorLegendPanel
            min={itemsPickedUpData.colorCodingMin!}
            max={itemsPickedUpData.colorCodingMax!}
            label="Time Played (m)"
          />
        </div>

        {/* Color Legend for Items Picked Up */}
        <div
          style={{
            ...chartContainerStyle,
            gridColumn: '7 / 13',
            gridRow: '12 / 14',
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 120,
          }}
        >
          <ColorLegendPanel
            min={itemsPutIntoContainersData.colorCodingMin!}
            max={itemsPutIntoContainersData.colorCodingMax!}
            label="Items picked up"
          />
        </div>
      </>
      }
    </SinglePanelLayout>
  );
}
