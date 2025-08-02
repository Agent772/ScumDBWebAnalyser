import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

/**
 * Displays a panel with various crafting statistics visualized as bar charts.
 *
 * The `CraftingStatsPanel` component renders multiple `LeaderboardBarChart` charts for different crafting categories,
 * such as guns, bullets, arrows, clothing, and melee weapons. Each chart visualizes the top crafting stats for its category,
 * with color coding based on time played. A color legend is also displayed to indicate the meaning of the color scale.
 *
 * @param {CraftingStatsPanelProps} props - The props for the component.
 * @param {Database} props.db - The database instance used to fetch crafting statistics.
 *
 * @returns {JSX.Element} The rendered crafting stats panel.
 */
export function CraftingStatsPanel({ db }: CraftingStatsPanelProps) {
  const { t } = useTranslation();
  const allStats = fetchAllCraftingStats(db);

  const gunsCraftedData = toChartData(allStats.MostGunsCrafted);
  const bulletsCraftedData = toChartData(allStats.MostBulletsCrafted);
  const arrowsCraftedData = toChartData(allStats.MostArrowsCrafted);
  const clothingCraftedData = toChartData(allStats.MostClothingCrafted);
  const meleeWeaponsCraftedData = toChartData(allStats.MostMeleeWeaponsCrafted);

  const panelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  return (
    <SinglePanelLayout
      header={t('crafting_panel.panel_header')}
      panelRef={panelRef}
      className="crafting-stats-panel"
      exportFileName="crafting-stats-analysis.png"
      discordFileName="crafting-stats-analysis.png"
    >
      {({ disableAnimation }) => <>
        {/* Guns Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>{t('crafting_panel.guns_crafted')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={gunsCraftedData}
              kpiLabel={t('crafting_panel.guns_crafted')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Bullets Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
          <div style={{ ...chartHeaderStyle }}>{t('crafting_panel.bullets_crafted')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={bulletsCraftedData}
              kpiLabel={t('crafting_panel.bullets_crafted')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Arrows Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>{t('crafting_panel.arrows_crafted')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={arrowsCraftedData}
              kpiLabel={t('crafting_panel.arrows_crafted')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Clothing Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
          <div style={{ ...chartHeaderStyle }}>{t('crafting_panel.clothing_crafted')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={clothingCraftedData}
              kpiLabel={t('crafting_panel.clothing_crafted')}
              coloringLabel={t('time_played_m')}
              yAxisWidth={120}
              disableAnimation={disableAnimation}
            />
          </div>
        </div>
        {/* Melee Weapons Crafted */}
        <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
          <div style={{ ...chartHeaderStyle }}>{t('crafting_panel.melee_weapons_crafted')}</div>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
            <LeaderboardBarChart
              data={meleeWeaponsCraftedData}
              kpiLabel={t('crafting_panel.melee_weapons_crafted')}
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
          }}
        >
          <ColorLegendPanel
            min={gunsCraftedData.colorCodingMin!}
            max={gunsCraftedData.colorCodingMax!}
            label={t('time_played_m')}
          />
        </div>
      </>}
    </SinglePanelLayout>
  );
}
