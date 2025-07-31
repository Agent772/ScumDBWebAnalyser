import { Database } from 'sql.js';
import { parseBlob } from '../../utils/blobParser';
import type { ChartEntry } from '../../utils/types/ChartData';
import { extractAttributeFromTemplateXml } from '../../utils/extractAttributeFromTemplateXml';

// Internal structure to hold all skill stats in memory after one DB query
interface AllSkillStats {
  strength: ChartEntry[];
  constitution: ChartEntry[];
  dexterity: ChartEntry[];
  intelligence: ChartEntry[];
  playTimes: number[];
}

export function fetchAllSkillStats(db: Database): AllSkillStats {
  const res = db.exec(`
    SELECT up.name, up.template_xml, p.body_simulation, up.play_time / 60 AS play_time
    FROM user_profile up
    JOIN prisoner p ON up.prisoner_id = p.id
    WHERE up.template_xml IS NOT NULL AND p.body_simulation IS NOT NULL
  `);
  if (!res[0]) {
    return {
      strength: [],
      constitution: [],
      dexterity: [],
      intelligence: [],
      playTimes: [],
    };
  }
  const rows = res[0].values;
  const strengthArr: ChartEntry[] = [];
  const constitutionArr: ChartEntry[] = [];
  const dexterityArr: ChartEntry[] = [];
  const intelligenceArr: ChartEntry[] = [];
  const playTimes: number[] = [];

  for (const row of rows) {
    const name = row[0] as string;
    const templateXml = row[1] as string;
    const bodySimBlob = row[2] as Uint8Array | ArrayBuffer;
    const play_time = Number(row[3] ?? 0);
    playTimes.push(play_time);
    const strength = extractAttributeFromTemplateXml(templateXml, 'Strength');
    const constitution = extractAttributeFromTemplateXml(templateXml, 'Constitution');
    const dexterity = extractAttributeFromTemplateXml(templateXml, 'Dexterity');
    const intelligence = extractAttributeFromTemplateXml(templateXml, 'Intelligence');
    const blob = bodySimBlob instanceof Uint8Array ? bodySimBlob : new Uint8Array(bodySimBlob);
    const parsed = parseBlob(blob, [
      'BaseStrength',
      'BaseConstitution',
      'BaseDexterity',
      'BaseIntelligence',
    ]);
    const baseStrength = Number(parsed.result['BaseStrength'] ?? 0);
    const baseConstitution = Number(parsed.result['BaseConstitution'] ?? 0);
    const baseDexterity = Number(parsed.result['BaseDexterity'] ?? 0);
    const baseIntelligence = Number(parsed.result['BaseIntelligence'] ?? 0);
    strengthArr.push({ name, kpi: strength + baseStrength, colorCodingKpi: play_time });
    constitutionArr.push({ name, kpi: constitution + baseConstitution, colorCodingKpi: play_time });
    dexterityArr.push({ name, kpi: dexterity + baseDexterity, colorCodingKpi: play_time });
    intelligenceArr.push({ name, kpi: intelligence + baseIntelligence, colorCodingKpi: play_time });
  }
  return { strength: strengthArr, constitution: constitutionArr, dexterity: dexterityArr, intelligence: intelligenceArr, playTimes };
}

// Structure for all prisoner skills grouped by skill name
export interface AllPrisonerSkills {
  [skillName: string]: ChartEntry[];
}

/**
 * Fetches all prisoner skills, grouped by skill name, with player name and play time for color coding.
 * @param db The sql.js Database instance
 * @returns An object mapping skill names to arrays of ChartEntry
 */
export function fetchAllPrisonerSkills(db: Database): AllPrisonerSkills {
  // Query joins user_profile, prisoner, and prisoner_skill
  const res = db.exec(`
    SELECT up.name, up.play_time / 60 AS play_time, ps.name AS skill_name, ps.level, ps.experience
    FROM user_profile up
    JOIN prisoner p ON up.prisoner_id = p.id
    JOIN prisoner_skill ps ON ps.prisoner_id = p.id
    WHERE up.name IS NOT NULL AND ps.name IS NOT NULL
  `);
  if (!res[0]) return {};
  const rows = res[0].values;
  const skills: AllPrisonerSkills = {};
  for (const row of rows) {
    const playerName = row[0] as string;
    const playTime = Number(row[1] ?? 0);
    let skillName = row[2] as string;
    // Remove trailing 'Skill' if present (case-sensitive)
    if (skillName.endsWith('Skill')) {
      skillName = skillName.slice(0, -5);
    }
    // You can choose to use level or experience as KPI; here we use experience for more granularity
    const experience = Number(row[4] ?? 0);
    if (!skills[skillName]) skills[skillName] = [];
    skills[skillName].push({
      name: playerName,
      kpi: experience,
      colorCodingKpi: playTime,
    });
  }
  return skills;
}