import { Database } from 'sql.js';
import type { ChartEntry } from '../../utils/types/ChartData';

// Internal structure to hold all kills stats in memory after one DB query
interface AllFoodStats {
  TotalDefecations: ChartEntry[];
  TotalUrinations: ChartEntry[];
  FoodEaten: ChartEntry[];
  LiquidDrank: ChartEntry[];
  TotalCaloriesIntake: ChartEntry[];
  Diarrheas: ChartEntry[];
  Vomits: ChartEntry[];
  MushroomsEaten: ChartEntry[];
  Starvation: ChartEntry[];
  AlcoholDrank: ChartEntry[];
  LightsFired: ChartEntry[];
  PlayTimes: number[];
}


export function fetchAllFoodStats(db: Database): AllFoodStats {
  const res = db.exec(`
    SELECT up.name, up.play_time / 60 AS play_time,
      s.total_defecations,
      s.total_urinations,
      s.food_eaten,
      s.liquid_drank,
      s.total_calories_intake,
      s.diarrheas,
      s.vomits,
      s.mushrooms_eaten,
      s.starvation,
      s.alcohol_drank,
      s.lights_fired
    FROM user_profile up
    JOIN survival_stats s ON up.id = s.user_profile_id
  `);

  if (!res || res.length === 0) {
    return {
      TotalDefecations: [],
      TotalUrinations: [],
      FoodEaten: [],
      LiquidDrank: [],
      TotalCaloriesIntake: [],
      Diarrheas: [],
      Vomits: [],
      MushroomsEaten: [],
      Starvation: [],
      AlcoholDrank: [],
      LightsFired: [],
      PlayTimes: [],
    };
  }

  const { columns, values } = res[0];

  const TotalDefecations: ChartEntry[] = [];
  const TotalUrinations: ChartEntry[] = [];
  const FoodEaten: ChartEntry[] = [];
  const LiquidDrank: ChartEntry[] = [];
  const TotalCaloriesIntake: ChartEntry[] = [];
  const Diarrheas: ChartEntry[] = [];
  const Vomits: ChartEntry[] = [];
  const MushroomsEaten: ChartEntry[] = [];
  const Starvation: ChartEntry[] = [];
  const AlcoholDrank: ChartEntry[] = [];
  const LightsFired: ChartEntry[] = [];
  const PlayTimes: number[] = [];

  for (const row of values) {
    const name = row[columns.indexOf('name')] as string;
    const playTime = row[columns.indexOf('play_time')] as number;
    const totalDefecations = row[columns.indexOf('total_defecations')] as number;
    const totalUrinations = row[columns.indexOf('total_urinations')] as number;
    const foodEaten = row[columns.indexOf('food_eaten')] as number;
    const liquidDrank = row[columns.indexOf('liquid_drank')] as number;
    const totalCaloriesIntake = row[columns.indexOf('total_calories_intake')] as number;
    const diarrheas = row[columns.indexOf('diarrheas')] as number;
    const vomits = row[columns.indexOf('vomits')] as number;
    const mushroomsEaten = row[columns.indexOf('mushrooms_eaten')] as number;
    const starvation = row[columns.indexOf('starvation')] as number;
    const alcoholDrank = row[columns.indexOf('alcohol_drank')] as number;
    const lightsFired = row[columns.indexOf('lights_fired')] as number;

    TotalDefecations.push({ name, kpi: totalDefecations, colorCodingKpi: playTime });
    TotalUrinations.push({ name, kpi: totalUrinations, colorCodingKpi: playTime });
    FoodEaten.push({ name, kpi: foodEaten, colorCodingKpi: playTime });
    LiquidDrank.push({ name, kpi: liquidDrank, colorCodingKpi: playTime });
    TotalCaloriesIntake.push({ name, kpi: totalCaloriesIntake, colorCodingKpi: playTime });
    Diarrheas.push({ name, kpi: diarrheas, colorCodingKpi: playTime });
    Vomits.push({ name, kpi: vomits, colorCodingKpi: playTime });
    MushroomsEaten.push({ name, kpi: mushroomsEaten, colorCodingKpi: playTime });
    Starvation.push({ name, kpi: starvation, colorCodingKpi: playTime });
    AlcoholDrank.push({ name, kpi: alcoholDrank, colorCodingKpi: playTime });
    LightsFired.push({ name, kpi: lightsFired, colorCodingKpi: playTime });
    PlayTimes.push(playTime);
  }

  return {
    TotalDefecations,
    TotalUrinations,
    FoodEaten,
    LiquidDrank,
    TotalCaloriesIntake,
    Diarrheas,
    Vomits,
    MushroomsEaten,
    Starvation,
    AlcoholDrank,
    LightsFired,
    PlayTimes
  };
}
