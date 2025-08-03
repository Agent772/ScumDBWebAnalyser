/**
 * Displays a panel with various looting-related statistics visualized as bar charts.
 *
 * This panel includes charts for:
 * - Locks Picked
 * - Containers Looted
 * - Items Picked Up
 * - Items Put Into Containers
 * - Highest Weight Carried
 *
 * Each chart uses leaderboard-style bar charts and color coding based on relevant metrics.
 * Color legends are provided for "Time Played (m)" and "Items Picked Up".
 *
 * @param {LootingStatsPanelProps} props - The component props.
 * @param {Database} props.db - The SQL.js database instance to fetch looting stats from.
 *
 * @returns {JSX.Element} The rendered looting stats panel.
 */
import { useRef } from 'react';
import { Database } from 'sql.js';
import { fetchAllLootingStats } from './lootingData';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle} from '../../ui/helpers/chartHelpers';
import { toChartData } from '../../utils/chartDataHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';
import { ChartFooter } from '../../ui/helpers/chartFooter';
import { useTranslation } from 'react-i18next';

interface LootingStatsPanelProps {
  db: Database;
}


export function LootingStatsPanel({ db }: LootingStatsPanelProps) {
  const { t } = useTranslation();
  const allStats = fetchAllLootingStats(db);

  const containersLootedData = toChartData(allStats.ContainersLooted);
  const itemsPutIntoContainersData = toChartData(allStats.ItemsPutIntoContainers);
  const highestWeightCarriedData = toChartData(allStats.HighestWeightCarried);
  const locksPickedData = toChartData(allStats.LocksPicked);
  const itemsPickedUpData = toChartData(allStats.ItemsPickedUp);

  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <SinglePanelLayout
      header={t('looting_panel.panel_header')}
      panelRef={panelRef}
      className="looting-stats-panel"
      exportFileName="looting-stats-analysis.png"
      discordFileName="looting-stats-analysis.png"
    >
      {({ disableAnimation }) => <>
        {/* Locks Picked */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>{t('looting_panel.locks_picked')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={locksPickedData}
              kpiLabel={t('looting_panel.locks_picked')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

        {/* Containers Looted */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>{t('looting_panel.containers_looted')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={containersLootedData}
              kpiLabel={t('looting_panel.containers_looted')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

         {/* Items picked up */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>{t('looting_panel.items_picked_up')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={itemsPickedUpData}
              kpiLabel={t('looting_panel.items_picked_up')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>

        {/* Items put into Containers */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>{t('looting_panel.items_put_into_containers')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={itemsPutIntoContainersData}
              kpiLabel={t('looting_panel.items_put_into_containers')}
              coloringLabel={t('looting_panel.items_picked_up')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
          <ChartFooter text={t('looting_panel.items_put_into_containers_footer')} />
        </div>
        {/* Highest Weight carried */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>{t('looting_panel.highest_weight_carried')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={highestWeightCarriedData}
              kpiLabel={t('looting_panel.highest_weight_carried')}
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
            label={t('time_played_m')}
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
            label={t('looting_panel.items_picked_up')}
          />
        </div>
      </>}
    </SinglePanelLayout>
  );
}
