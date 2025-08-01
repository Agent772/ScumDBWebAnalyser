

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


interface KillStatsPanelProps {
  db: Database;
}



export function KillStatsPanel({ db }: KillStatsPanelProps) {
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
        if (i === 0) return 'Kills Leaderboards';
        if (i === 1) return 'Puppets & Prisoners Kills';
        if (i === 2) return 'Weapons Details';
        if (i === 3) return 'Shots & Melee Stats';
        return '';
      }} getPanelFileName={i => {
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
              <ColorLegendPanel idSuffix={String(groupIndex)} min={killsData.colorCodingMin!} max={killsData.colorCodingMax!} label='Time Played (m)' />
              {/* <ColorLegendPanel idSuffix={String(groupIndex)} min={highestAllKDData.colorCodingMin!} max={highestAllKDData.colorCodingMax!} label='All Kills' /> */}
              {/* Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Kills</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={killsData}
                    kpiLabel="Kills"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Death Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Death</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={deathData}
                    kpiLabel="Death"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Longest Kill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Longest Kill</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={longestKillDistanceData}
                    kpiLabel="Longest Kill"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* All KD Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>All K/D</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={highestAllKDData}
                    kpiLabel="All K/D"
                    coloringLabel="Kills"
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
                <div style={{ ...chartHeaderStyle }}>Puppet Kills</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={puppetKilledData}
                    kpiLabel="Puppet Kills"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Prisoner Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Prisoner Kills</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={prisonerKillsData}
                    kpiLabel="Prisoner Kills"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Deaths by Prisoners Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Deaths by Prisoners</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={deathByPrisonersData}
                    kpiLabel="Deaths by Prisoners"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              
              {/* Prisoner KD Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Prisoner K/D</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={highestPrisonerKDData}
                    kpiLabel="Prisoner K/D"
                    coloringLabel="Prisoner Kills"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Puppets KO Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Puppets KO'd</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={puppetsKnockedOutData}
                    kpiLabel="Puppets KO'd"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              {/* Player KO Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Player KO'd</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={playerKnockedOutData}
                    kpiLabel="Player KO'd"
                    coloringLabel="Time Played (m)"
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
                <div style={{ ...chartHeaderStyle }}>Melee Kills</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={meleeKillsData}
                    kpiLabel="Melee Kills"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Archery Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Archery Kills</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={archeryKillsData}
                    kpiLabel="Archery Kills"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Firearm Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Firearm Kills</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={firearmKillsData}
                    kpiLabel="Firearm Kills"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Bare Handed Kills Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Bare Handed Kills</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={bareHandedKillsData}
                    kpiLabel="Bare Handed Kills"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

                {/* Drone Kills Chart */}
                <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                  <div style={{ ...chartHeaderStyle }}>Drone Kills</div>
                  <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                    <LeaderboardBarChart
                      data={droneKillsData}
                      kpiLabel="Drone Kills"
                      coloringLabel="Time Played (m)"
                      yAxisWidth={120}
                      disableAnimation={disableAnimation}
                    />
                  </div>
                </div>

                {/* Sentry Kills Chart */}
                <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '10 / 14' }}>
                  <div style={{ ...chartHeaderStyle }}>Sentry Kills</div>
                  <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                    <LeaderboardBarChart
                      data={sentryKillsData}
                      kpiLabel="Sentry Kills"
                      coloringLabel="Time Played (m)"
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
              <ColorLegendPanel idSuffix={String(groupIndex)} min={shotsHitData.colorCodingMin!} max={shotsHitData.colorCodingMax!} label='Shots Fired' />
              {/* Shots Fired Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Shots Fired</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={shotsFiredData}
                    kpiLabel="Shots Fired"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Shots Hit Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Shots Hit</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={shotsHitData}
                    kpiLabel="Shots Hit"
                    coloringLabel="Shots Fired"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Headshots Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Headshots</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={headshotsData}
                    kpiLabel="Headshots"
                    coloringLabel="Shots Fired"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
                <div style={{ textAlign: 'left', fontSize: 10, color: COLORS.text, margin: '0 0 5px 16px' }}>
                    It seams SCUM counts headshots at least from bows too, maybe from meelee weapons also.
                </div>
              </div>

              {/* Accuracy Chart with Material UI Slider beside header */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span>Accuracy</span>
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 11 }}>
                    <span style={{ marginRight: 6, marginLeft: 50 }}>Min Shots Fired:</span>
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
                    kpiLabel="Accuracy"
                    coloringLabel="Shots Fired"
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
