import { useRef } from 'react';
import { Database } from 'sql.js';
import { fetchAllCraftingStats } from './craftingData';
import { SinglePanelLayout } from '../shared/SinglePanelLayout';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle} from '../../ui/helpers/chartHelpers';
import { toChartData } from '../../utils/chartDataHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';

interface CraftingStatsPanelProps {
  db: Database;
}

export function CraftingStatsPanel({ db }: CraftingStatsPanelProps) {
  const allStats = fetchAllCraftingStats(db);

  const gunsCraftedData = toChartData(allStats.MostGunsCrafted);
  const bulletsCraftedData = toChartData(allStats.MostBulletsCrafted);
  const arrowsCraftedData = toChartData(allStats.MostArrowsCrafted);
  const clothingCraftedData = toChartData(allStats.MostClothingCrafted);
  const meleeWeaponsCraftedData = toChartData(allStats.MostMeleeWeaponsCrafted);

  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <SinglePanelLayout
      header="Crafting Stats"
      panelRef={panelRef}
      className="crafting-stats-panel"
      exportFileName="crafting-stats-analysis.png"
      discordFileName="crafting-stats-analysis.png"
    >
      {({ disableAnimation }) => <>
        {/* Guns Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>Guns Crafted</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={gunsCraftedData}
              kpiLabel='Guns Crafted'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Bullets Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>Bullets Crafted</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={bulletsCraftedData}
              kpiLabel='Bullets Crafted'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Arrows Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>Arrows Crafted</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={arrowsCraftedData}
              kpiLabel='Arrows Crafted'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Clothing Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>Clothing Crafted</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={clothingCraftedData}
              kpiLabel='Clothing Crafted'
              coloringLabel="Time Played (m)"
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Melee Weapons Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>Melee Weapons Crafted</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={meleeWeaponsCraftedData}
              kpiLabel='Melee Weapons Crafted'
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
                  min={gunsCraftedData.colorCodingMin!}
                  max={gunsCraftedData.colorCodingMax!}
                  label="Time Played (m)"
                />
              </div>
      </>}
    </SinglePanelLayout>
  );
}
