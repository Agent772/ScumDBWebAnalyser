import { parseBlob } from '../../utils/blobParser';


export const BODY_SIMULATION_KEYS = [
  'IsDead',
  'BaseStrength',
  'BaseConstitution',
  'BaseDexterity',
  'BaseIntelligence',
  'InitialAge',
  'LifeTimeSinceInitialization',
  'LifeTimeSinceSpawn',
  'TimeOfDeath',
  'TimeOfRevive',
  'TimeOfComa',
  'TimeOfComaWakeUp',
  'Stamina',
  'AccumulatedFatigue',
  'HeartRate',
  'BreathingRate',
  'OxygenSaturation',
  'BodyTemperature',
  'PhoenixTearsAmount',
];

export interface BodySimulationResult {
  name: string;
  bodySimulation: Record<string, number | bigint | (number | bigint)[]>;
  warnings: string[];
}

export interface BodySimulationProfile {
  name: string;
  prisoner_user_profile_prisoner_idToprisoner?: {
    body_simulation?: Uint8Array | ArrayBuffer | null;
  };
}

/**
 * Extracts body simulation data from a user profile object.
 * @param profile The user profile object with nested prisoner and body_simulation blob.
 * @param keys The list of keys to extract (default: BODY_SIMULATION_KEYS)
 * @returns BodySimulationResult or null if not found/invalid
 */
export function extractBodySimulation(
  profile: BodySimulationProfile | null | undefined,
  keys: string[] = BODY_SIMULATION_KEYS
): BodySimulationResult | null {
  if (!profile || !profile.prisoner_user_profile_prisoner_idToprisoner?.body_simulation) {
    return null;
  }
  // Accept both ArrayBuffer and Uint8Array
  const blob = profile.prisoner_user_profile_prisoner_idToprisoner.body_simulation instanceof Uint8Array
    ? profile.prisoner_user_profile_prisoner_idToprisoner.body_simulation
    : new Uint8Array(profile.prisoner_user_profile_prisoner_idToprisoner.body_simulation);

  const parsed = parseBlob(blob, keys);
  return {
    name: profile.name,
    bodySimulation: parsed.result,
    warnings: parsed.warnings,
  };
}
