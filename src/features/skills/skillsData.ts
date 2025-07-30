
import { Database } from 'sql.js';
import { parseBlob } from '../../utils/blobParser';

export interface SkillStatsEntry {
  name: string;
  value: number;
  play_time: number;
}

export interface SkillStatsAnalytics {
  strength: SkillStatsEntry[];
  constitution: SkillStatsEntry[];
  dexterity: SkillStatsEntry[];
  intelligence: SkillStatsEntry[];
  playTimeMin: number;
  playTimeMax: number;
}

function extractAttributeFromTemplateXml(xml: string, attr: string): number {
  const regex = new RegExp(`${attr}="([0-9.]+)"`);
  const match = xml.match(regex);
  return match ? parseFloat(match[1]) : 0;
}

export function getSkillStatsAnalytics(db: Database): SkillStatsAnalytics {
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
      playTimeMin: 0,
      playTimeMax: 0,
    };
  }
  const rows = res[0].values;
  const strengthArr: SkillStatsEntry[] = [];
  const constitutionArr: SkillStatsEntry[] = [];
  const dexterityArr: SkillStatsEntry[] = [];
  const intelligenceArr: SkillStatsEntry[] = [];
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
    strengthArr.push({ name, value: strength + baseStrength, play_time });
    constitutionArr.push({ name, value: constitution + baseConstitution, play_time });
    dexterityArr.push({ name, value: dexterity + baseDexterity, play_time });
    intelligenceArr.push({ name, value: intelligence + baseIntelligence, play_time });
  }

  const round2 = (n: number) => Math.round(n * 100) / 100;
  const playTimeMin = playTimes.length > 0 ? Math.min(...playTimes) : 0;
  const playTimeMax = playTimes.length > 0 ? Math.max(...playTimes) : 0;
  return {
    strength: strengthArr
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(({ name, value, play_time }) => ({ name, value: round2(value), play_time })),
    constitution: constitutionArr
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(({ name, value, play_time }) => ({ name, value: round2(value), play_time })),
    dexterity: dexterityArr
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(({ name, value, play_time }) => ({ name, value: round2(value), play_time })),
    intelligence: intelligenceArr
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(({ name, value, play_time }) => ({ name, value: round2(value), play_time })),
    playTimeMin,
    playTimeMax,
  };
}

