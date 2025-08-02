
/**
 * Renders a multi-panel leaderboard dashboard for skill statistics and XP leaderboards.
 * 
 * This panel displays various skill leaderboards for prisoners, grouped by skill categories:
 * - Basic (Strength, Constitution, Dexterity, Intelligence)
 * - Strength (Boxing, Rifles, Melee Weapons, Handgun, Archery)
 * - Constitution (Running, Endurance)
 * - Dexterity (Thievery, Driving, Demolition, Motorcycle, Stealth, Aviation)
 * - Intelligence (Awareness, Sniping, Camouflage, Survival, Cooking, Engineering, Medical)
 * 
 * Each panel contains one or more bar charts visualizing the top performers for each skill,
 * colored by time played. A color legend is included for reference.
 * 
 * @param {SkillStatsPanelProps} props - The component props.
 * @param {Database} props.db - The SQL.js database instance to fetch skill data from.
 * @returns {JSX.Element} The rendered skill stats panel with multiple leaderboard charts.
 */
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
  // Panel 1 (General) Data Preparation
  const strengthData = toChartData(allStats.strength);
  const constitutionData = toChartData(allStats.constitution);
  const dexterityData = toChartData(allStats.dexterity);
  const intelligenceData = toChartData(allStats.intelligence);

  // Panel 2 (Strenght) Data Preparation
  const boxingData = toChartData(allPrisonerSkills['Boxing'] || []);
  const rifleData = toChartData(allPrisonerSkills['Rifles'] || []);
  const meleeData = toChartData(allPrisonerSkills['MeleeWeapons'] || []);
  const handgunData = toChartData(allPrisonerSkills['Handgun'] || []);
  const archeryData = toChartData(allPrisonerSkills['Archery'] || []);

  // Panel 3 (Constitution) Data Preparation
  const runningData = toChartData(allPrisonerSkills['Running'] || []);
  const enduranceData = toChartData(allPrisonerSkills['Endurance'] || []);

  //Panel 4 (Dexterity) Data Preparation
  const thieveryData = toChartData(allPrisonerSkills['Thievery'] || []);
  const drivingData = toChartData(allPrisonerSkills['Driving'] || []);
  const demolitionData = toChartData(allPrisonerSkills['Demolition'] || []);
  const motorcycleData = toChartData(allPrisonerSkills['Motorcycle'] || []);
  const stealthData = toChartData(allPrisonerSkills['Stealth'] || []);
  const aviationData = toChartData(allPrisonerSkills['Aviation'] || []);

  // Panel 5 (Intelligence) Data Preparation
  const awarenessData = toChartData(allPrisonerSkills['Awareness'] || []);
  const snipingData = toChartData(allPrisonerSkills['Sniping'] || []);
  const camouflageData = toChartData(allPrisonerSkills['Camouflage'] || []);
  const survivalData = toChartData(allPrisonerSkills['Survival'] || []);
  const cookingData = toChartData(allPrisonerSkills['Cooking'] || []);
  const engineeringData = toChartData(allPrisonerSkills['Engineering'] || []);
  const medicalData = toChartData(allPrisonerSkills['Medical'] || []);

  return (
    <MultiPanelLayout
      groupCount={6}
      getPanelHeader={i => {
        if (i === 0) return 'Basic Skill Leaderboards';
        if (i === 1) return 'Strength Skill Leaderboards';
        if (i === 2) return 'Constitution Skill Leaderboards';
        if (i === 3) return 'Dexterity Skill Leaderboards';
        if (i === 4) return 'Intelligence Skill Leaderboards (1/2)';
        if (i === 5) return 'Intelligence Skill Leaderboards (2/2)';
        return '';
      }} getPanelFileName={i => {
        if (i === 0) return 'skills-leaderboards.png';
        if (i === 1) return 'Strength-skills.png';
        if (i === 2) return 'Constitution-skills.png';
        if (i === 3) return 'Dexterity-skills.png';
        if (i === 4) return 'Intelligence-skills.png';
        if (i === 5) return 'Intelligence-skills-2.png';
        return '';
      }}
    >
      {(groupIndex, { disableAnimation }) => {
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
                    disableAnimation={disableAnimation}
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
                    disableAnimation={disableAnimation}
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
                    disableAnimation={disableAnimation}
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
              {/* Boxing Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Boxing</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={boxingData}
                    kpiLabel="Boxing XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
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
                    disableAnimation={disableAnimation}
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
                    disableAnimation={disableAnimation}
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
                    disableAnimation={disableAnimation}
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
                    disableAnimation={disableAnimation}
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
        } if (groupIndex === 2) {
          // Panel 3
          return (
            <>
              {/* Running Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Running</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={runningData}
                    kpiLabel="Running XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Endurance Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Endurance</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={enduranceData}
                    kpiLabel="Endurance XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              
              {/* Color Legend */}
              <div
                style={{
                  ...chartContainerStyle,
                  gridColumn: '1 / 13',
                  gridRow: '6 / 7',
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ColorLegendPanel
                  idSuffix={String(groupIndex)}
                  min={runningData.colorCodingMin!}
                  max={runningData.colorCodingMax!}
                  label="Time Played (m)"
                />
              </div>
            </>
          );
        } if (groupIndex === 3) {
          // Panel 4
          return (
            <>
              {/* Thievery Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Thievery</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={thieveryData}
                    kpiLabel="Thievery XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Driving Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>Driving</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={drivingData}
                    kpiLabel="Driving XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Demolition Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Demolition</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={demolitionData}
                    kpiLabel="Demolition XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Motorcycle Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>Motorcycle</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={motorcycleData}
                    kpiLabel="Motorcycle XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Stealth Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Stealth</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={stealthData}
                    kpiLabel="Stealth XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Aviation Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Aviation</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={aviationData}
                    kpiLabel="Aviation XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
            </>
          );
        } if (groupIndex === 4) {
          // Panel 5
          return (
            <>
              {/* Awareness Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Awareness</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={awarenessData}
                    kpiLabel="Awareness XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Sniping Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Sniping</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={snipingData}
                    kpiLabel="Sniping XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Camouflage Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Camouflage</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={camouflageData}
                    kpiLabel="Camouflage XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Survival Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Survival</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={survivalData}
                    kpiLabel="Survival XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
            </>
          );
        } else if (groupIndex === 5) {
          // Panel 6
          return (
            <>
              {/* Cooking Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Cooking</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={cookingData}
                    kpiLabel="Cooking XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Engineering Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>Engineering</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={engineeringData}
                    kpiLabel="Engineering XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* medical Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>Medical</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={medicalData}
                    kpiLabel="Medical XP"
                    coloringLabel="Time Played (m)"
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Color Legend */}
              <div
                style={{
                  ...chartContainerStyle,
                  gridColumn: '8 / 13',
                  gridRow: '8 / 14',
                  background: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ColorLegendPanel
                  idSuffix={String(groupIndex)}
                  min={runningData.colorCodingMin!}
                  max={runningData.colorCodingMax!}
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
