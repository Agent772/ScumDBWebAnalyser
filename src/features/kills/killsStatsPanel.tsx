/**
 * KillStatsPanel displays a multi-panel leaderboard with various kill and death statistics
 * for players, puppets, and weapons, based on the provided SQLite database.
 *
 * The panel is divided into four groups:
 * 1. Kills Leaderboards: Shows most kills, deaths, longest kill distances, and overall K/D ratios.
 * 2. Puppets & Prisoners Kills: Displays stats for puppet kills, prisoner kills, deaths by prisoners, K/D ratios, and knockouts.
 * 3. Weapons Details: Breaks down kills by melee, archery, firearms, bare hands, drones, and sentries.
 * 4. Shots & Melee Stats: Shows shots fired, shots hit, headshots, and accuracy (with a slider to filter by minimum shots fired).
 *
 * Each panel uses LeaderboardBarChart for visualization and ColorLegendPanel for color coding explanations.
 * The component is highly interactive and supports disabling animations for export or performance.
 *
 * @param {KillStatsPanelProps} props - The component props.
 * @param {Database} props.db - The SQLite database instance containing the stats data.
 * @returns {JSX.Element} The rendered multi-panel leaderboard component.
 */
import { useState } from 'react';
import Slider from '@mui/material/Slider';
import { MultiPanelLayout } from '../shared/MultiPanelLayout';
import { fetchAllKillsStats } from './killsData';
import { Database } from 'sql.js';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle } from '../../ui/helpers/chartHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';
import { toChartData } from '../../utils/chartDataHelpers';
import { COLORS } from '../../ui/helpers/colors';
import { ChartFooter } from '../../ui/helpers/chartFooter';
import { useTranslation } from 'react-i18next';


interface KillStatsPanelProps {
  db: Database;
}

export function KillStatsPanel({ db }: KillStatsPanelProps) {
  const { t } = useTranslation();
  const allStats = fetchAllKillsStats(db);
  // Panel 1 (Kills Overview) Data Preparation
  const killsData = toChartData(allStats.MostKills);
  const deathData = toChartData(allStats.MostDeaths);
  const longestKillDistanceData = toChartData(allStats.MostLongestKillDistance);
  const highestAllKDData = toChartData(allStats.HighestAllKD);

  // Panel 2 (Puppets and Prisoners) Data Preparation
  const puppetKilledData = toChartData(allStats.MostPuppetsKilled);
  const prisonerKillsData = toChartData(allStats.MostPrisonerKills);
  const deathByPrisonersData = toChartData(allStats.MostDeathsByPrisoners);
  const highestPrisonerKDData = toChartData(allStats.HighestPrisonerKD);
  const puppetsKnockedOutData = toChartData(allStats.MostPuppetsKnockedOut);
  const playerKnockedOutData = toChartData(allStats.MostPlayersKnockedOut);

  // Panel 3 (Weapons) Data Preparation
  const meleeKillsData = toChartData(allStats.MostMeleeKills);
  const archeryKillsData = toChartData(allStats.MostArcheryKills);
  const firearmKillsData = toChartData(allStats.MostFirearmKills);
  const bareHandedKillsData = toChartData(allStats.MostBareHandedKills);
  const droneKillsData = toChartData(allStats.MostDroneKills);
  const sentryKillsData = toChartData(allStats.MostSentryKills);

  // Panel 4 (Shots and Melee Weapon Stats) Data Preparation
  const shotsFiredData = toChartData(allStats.MostShotsFired);
  const shotsHitData = toChartData(allStats.MostShotsHit);
  const headshotsData = toChartData(allStats.MostHeadshots);
  //   const meleeWeaponSwingsData = toChartData(allStats.MostMeleeWeaponSwings);
  //   const meleeWeaponHitsData = toChartData(allStats.MostMeleeWeaponHits);

  // Accuracy threshold state for slider
  const [accuracyThreshold, setAccuracyThreshold] = useState(1000);
  const filteredAccuracy = allStats.HighestAccuracy.filter(entry => (entry.colorCodingKpi ?? 0) >= accuracyThreshold);
  const highestAccuracyData = toChartData(filteredAccuracy);


  return (
    <MultiPanelLayout
      groupCount={4}
      getPanelHeader={i => {
        if (i === 0) return t('kills_panel.panel_header');
        if (i === 1) return t('kills_panel.panel_header_2');
        if (i === 2) return t('kills_panel.panel_header_3');
        if (i === 3) return t('kills_panel.panel_header_4');
        return '';
      }}
      getPanelFileName={i => {
        if (i === 0) return 'kills-leaderboards.png';
        if (i === 1) return 'puppets-prisoners-kills.png';
        if (i === 2) return 'weapons-details.png';
        if (i === 3) return 'shots-melee-stats.png';
        return '';
      }}
    >
      {(groupIndex, { disableAnimation }) => {
        if (groupIndex === 0) {
          return (
            <>
              <ColorLegendPanel idSuffix={String(groupIndex)} min={killsData.colorCodingMin!} max={killsData.colorCodingMax!} label={t('time_played_m')} />
              {/* Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.kills')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={killsData}
                    kpiLabel={t('kills_panel.kills')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Death Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.deaths')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={deathData}
                    kpiLabel={t('kills_panel.deaths')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Longest Kill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.longest_kill')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={longestKillDistanceData}
                    kpiLabel={t('kills_panel.longest_kill')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* All KD Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.all_kd')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={highestAllKDData}
                    kpiLabel={t('kills_panel.all_kd')}
                    coloringLabel={t('kills_panel.kills')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
            </>
          );
        } if (groupIndex === 1) {
          // Panel 2
          return (
            <>
              {/* Puppet Kill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.puppet_kills')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={puppetKilledData}
                    kpiLabel={t('kills_panel.puppet_kills')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Prisoner Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.prisoner_kills')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={prisonerKillsData}
                    kpiLabel={t('kills_panel.prisoner_kills')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Deaths by Prisoners Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.deaths_by_prisoners')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={deathByPrisonersData}
                    kpiLabel={t('kills_panel.deaths_by_prisoners')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              
              {/* Prisoner KD Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.prisoner_kd')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={highestPrisonerKDData}
                    kpiLabel={t('kills_panel.prisoner_kd')}
                    coloringLabel={t('kills_panel.prisoner_kills')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Puppets KO Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.puppets_ko')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={puppetsKnockedOutData}
                    kpiLabel={t('kills_panel.puppets_ko')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Player KO Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.player_ko')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={playerKnockedOutData}
                    kpiLabel={t('kills_panel.player_ko')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
            </>
          );
        } if (groupIndex === 2) {
          // Panel 3
          return (
            <>
              {/* Melee Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.melee_kills')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={meleeKillsData}
                    kpiLabel={t('kills_panel.melee_kills')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Archery Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.archery_kills')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={archeryKillsData}
                    kpiLabel={t('kills_panel.archery_kills')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Firearm Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.firearm_kills')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={firearmKillsData}
                    kpiLabel={t('kills_panel.firearm_kills')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Bare Handed Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.bare_handed_kills')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={bareHandedKillsData}
                    kpiLabel={t('kills_panel.bare_handed_kills')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

                {/* Drone Kills Chart */}
                <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                  <div style={{ ...chartHeaderStyle }}>{t('kills_panel.drone_kills')}</div>
                  <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                    <LeaderboardBarChart
                      data={droneKillsData}
                      kpiLabel={t('kills_panel.drone_kills')}
                      coloringLabel={t('time_played_m')}
                      yAxisWidth={120}
                      disableAnimation={disableAnimation}
                    />
                  </div>
                </div>

                {/* Sentry Kills Chart */}
                <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '10 / 14' }}>
                  <div style={{ ...chartHeaderStyle }}>{t('kills_panel.sentry_kills')}</div>
                  <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                    <LeaderboardBarChart
                      data={sentryKillsData}
                      kpiLabel={t('kills_panel.sentry_kills')}
                      coloringLabel={t('time_played_m')}
                      yAxisWidth={120}
                      disableAnimation={disableAnimation}
                    />
                  </div>
                </div>
              </>
            );
          } if (groupIndex === 3) {
            // Panel 4
            return (
            <>
              <ColorLegendPanel idSuffix={String(groupIndex)} min={shotsHitData.colorCodingMin!} max={shotsHitData.colorCodingMax!} label={t('kills_panel.shots_fired')} />
              {/* Shots Fired Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.shots_fired')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={shotsFiredData}
                    kpiLabel={t('kills_panel.shots_fired')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Shots Hit Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.shots_hit')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={shotsHitData}
                    kpiLabel={t('kills_panel.shots_hit')}
                    coloringLabel={t('kills_panel.shots_fired')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Headshots Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('kills_panel.headshots')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={headshotsData}
                    kpiLabel={t('kills_panel.headshots')}
                    coloringLabel={t('kills_panel.shots_fired')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
                <ChartFooter text={t('kills_panel.headshots_footer')} />
              </div>

              {/* Accuracy Chart with Material UI Slider beside header */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span>{t('kills_panel.accuracy')}</span>
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 11 }}>
                    <span style={{ marginRight: 6, marginLeft: 50 }}>{t('kills_panel.min_shots_fired')}:</span>
                    <Slider
                      value={accuracyThreshold}
                      min={0}
                      max={highestAccuracyData.colorCodingMax!}
                      step={10}
                      onChange={(_, v) => setAccuracyThreshold(Number(v))}
                      sx={{
                        width: 160,
                        mx: 2,
                        color: COLORS.primary,
                        '& .MuiSlider-thumb': {
                        width: 10,
                        height: 18,
                        borderRadius: 2,
                        backgroundColor: COLORS.primary,
                        border: `2px solid ${COLORS.primaryBorder}`,
                        boxShadow: 2,
                        },
                    }}
                    />
                    <span style={{ minWidth: 32, textAlign: 'right', fontSize: 11 }}>{accuracyThreshold}</span>
                  </div>
                </div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={highestAccuracyData}
                    kpiLabel={t('kills_panel.accuracy')}
                    coloringLabel={t('kills_panel.shots_fired')}
                    yAxisWidth={120}
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
