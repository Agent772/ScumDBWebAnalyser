
import { MultiPanelLayout } from '../shared/MultiPanelLayout';
import { fetchAllSkillStats, fetchAllPrisonerSkills } from './skillsData';
import { Database } from 'sql.js';
import { ColorLegendPanel } from '../../ui/helpers/ColorLegendPanel';
import { chartContainerStyle, chartHeaderStyle } from '../../ui/helpers/chartHelpers';
import { LeaderboardBarChart } from '../../ui/helpers/LeaderboardBarChart';
import { toChartData } from '../../utils/chartDataHelpers';

interface SkillStatsPanelProps {
  db: Database;
}


export function SkillStatsPanel({ db }: SkillStatsPanelProps) {
  const allStats = fetchAllSkillStats(db);
  const allPrisonerSkills = fetchAllPrisonerSkills(db);

  const strengthData = toChartData(allStats.strength);
  const constitutionData = toChartData(allStats.constitution);
  const dexterityData = toChartData(allStats.dexterity);
  const intelligenceData = toChartData(allStats.intelligence);

  // Prepare dedicated chart data for selected skills (add/remove as needed)
  const boxingData = toChartData(allPrisonerSkills['Boxing'] || []);
  const rifleData = toChartData(allPrisonerSkills['Rifles'] || []);
  const meleeData = toChartData(allPrisonerSkills['MeleeWeapons'] || []);
  const handgunData = toChartData(allPrisonerSkills['Handgun'] || []);
  const archeryData = toChartData(allPrisonerSkills['Archery'] || []);

  return (
    <MultiPanelLayout
      groupCount={2}
      getPanelHeader={i => i === 0 ? 'Basic Skill Leaderboards' : 'Strength Skill Leaderboards'}
      getPanelFileName={i => i === 0 ? 'skills-leaderboards.png' : 'Strength-skills.png'}
    >
      {groupIndex => {
        if (groupIndex === 0) {
          return (
            <>
              <ColorLegendPanel idSuffix={String(groupIndex)} min={strengthData.colorCodingMin!} max={strengthData.colorCodingMax!} label='Time Played (m)' />
              {/* Strength Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Strength</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={strengthData}
                    kpiLabel="Strength"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                  />
                </div>
              </div>

              {/* Constitution Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Constitution</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={constitutionData}
                    kpiLabel="Constitution"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                  />
                </div>
              </div>

              {/* Dexterity Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Dexterity</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={dexterityData}
                    kpiLabel="Dexterity"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                  />
                </div>
              </div>

              {/* Intelligence Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Intelligence</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={intelligenceData}
                    kpiLabel="Intelligence"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                  />
                </div>
              </div>
            </>
          );
        } else {
          // Panel 2
          return (
            <>
              {/* Boxing Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Boxing</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={boxingData}
                    kpiLabel="Boxing XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                  />
                </div>
              </div>

              {/* Rifle Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Rifle</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={rifleData}
                    kpiLabel="Rifle XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                  />
                </div>
              </div>

              {/* Melee Weapons Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Melee Weapons</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={meleeData}
                    kpiLabel="Melee Weapons XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                  />
                </div>
              </div>
              
              {/* Pistol Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Pistol</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={handgunData}
                    kpiLabel="Pistol XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                  />
                </div>
              </div>

              {/* Archery Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Archery</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={archeryData}
                    kpiLabel="Archery XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
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
                  min={boxingData.colorCodingMin!}
                  max={boxingData.colorCodingMax!}
                  label="Time Played (m)"
                />
              </div>
            </>
          );
        }
      }}
    </MultiPanelLayout>
  );
}
