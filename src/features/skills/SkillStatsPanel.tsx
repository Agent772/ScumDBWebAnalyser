
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
import { useTranslation } from 'react-i18next';


interface SkillStatsPanelProps {
  db: Database;
}



export function SkillStatsPanel({ db }: SkillStatsPanelProps) {
  const { t } = useTranslation();
  const allStats = fetchAllSkillStats(db);
  const allPrisonerSkills = fetchAllPrisonerSkills(db);
  // Panel 1 (General) Data Preparation
  const strengthData = toChartData(allStats.strength);
  const constitutionData = toChartData(allStats.constitution);
  const dexterityData = toChartData(allStats.dexterity);
  const intelligenceData = toChartData(allStats.intelligence);

  // Panel 2 (Strength) Data Preparation
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
        if (i === 0) return t('skills_panel.panel_header');
        if (i === 1) return t('skills_panel.panel_header_2');
        if (i === 2) return t('skills_panel.panel_header_3');
        if (i === 3) return t('skills_panel.panel_header_4');
        if (i === 4) return t('skills_panel.panel_header_5', { page: 1 });
        if (i === 5) return t('skills_panel.panel_header_5', { page: 2 });
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
              <ColorLegendPanel idSuffix={String(groupIndex)} min={strengthData.colorCodingMin!} max={strengthData.colorCodingMax!} label={t('time_played_m')} />
              {/* Strength Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.strength')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={strengthData}
                    kpiLabel={t('skills_panel.strength')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Constitution Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.constitution')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={constitutionData}
                    kpiLabel={t('skills_panel.constitution')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Dexterity Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.dexterity')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={dexterityData}
                    kpiLabel={t('skills_panel.dexterity')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Intelligence Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.intelligence')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={intelligenceData}
                    kpiLabel={t('skills_panel.intelligence')}
                    coloringLabel={t('time_played_m')}
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
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.boxing')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={boxingData}
                    kpiLabel={t('skills_panel.boxing') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Rifle Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.rifle')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={rifleData}
                    kpiLabel={t('skills_panel.rifle') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Melee Weapons Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.melee_weapons')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={meleeData}
                    kpiLabel={t('skills_panel.melee_weapons') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>
              
              {/* Pistol Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.pistol')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={handgunData}
                    kpiLabel={t('skills_panel.pistol') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Archery Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.archery')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={archeryData}
                    kpiLabel={t('skills_panel.archery') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
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
                  label={t('time_played_m')}
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
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.running')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={runningData}
                    kpiLabel={t('skills_panel.running') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Endurance Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.endurance')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={enduranceData}
                    kpiLabel={t('skills_panel.endurance') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
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
                  label={t('time_played_m')}
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
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.thievery')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={thieveryData}
                    kpiLabel={t('skills_panel.thievery') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Driving Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 6' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.driving')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={drivingData}
                    kpiLabel={t('skills_panel.driving') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Demolition Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.demolition')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={demolitionData}
                    kpiLabel={t('skills_panel.demolition') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Motorcycle Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '6 / 10' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.motorcycle')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={motorcycleData}
                    kpiLabel={t('skills_panel.motorcycle') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Stealth Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.stealth')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={stealthData}
                    kpiLabel={t('skills_panel.stealth') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Aviation Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '10 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.aviation')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={aviationData}
                    kpiLabel={t('skills_panel.aviation') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
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
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.awareness')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={awarenessData}
                    kpiLabel={t('skills_panel.awareness') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Sniping Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.sniping')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={snipingData}
                    kpiLabel={t('skills_panel.sniping') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Camouflage Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.camouflage')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={camouflageData}
                    kpiLabel={t('skills_panel.camouflage') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Survival Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.survival')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={survivalData}
                    kpiLabel={t('skills_panel.survival') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
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
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.cooking')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={cookingData}
                    kpiLabel={t('skills_panel.cooking') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* Engineering Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '7 / 13', gridRow: '2 / 8' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.engineering')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={engineeringData}
                    kpiLabel={t('skills_panel.engineering') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
                    yAxisWidth={120}
                    disableAnimation={disableAnimation}
                  />
                </div>
              </div>

              {/* medical Skill Chart */}
              <div style={{ ...chartContainerStyle, gridColumn: '1 / 7', gridRow: '8 / 14' }}>
                <div style={{ ...chartHeaderStyle }}>{t('skills_panel.medical')}</div>
                <div style={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
                  <LeaderboardBarChart
                    data={medicalData}
                    kpiLabel={t('skills_panel.medical') + ' ' + t('skills_panel.xp')}
                    coloringLabel={t('time_played_m')}
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
                  label={t('time_played_m')}
                />
              </div>
            </>
          );
        }
      }}
    </MultiPanelLayout>
  );
}
