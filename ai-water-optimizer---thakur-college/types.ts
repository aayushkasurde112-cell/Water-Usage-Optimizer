
export interface WaterSample {
  id: number;
  tank_capacity: number;
  household_size: number;
  usage_pattern: 'Low' | 'Moderate' | 'High';
  leak_status: number;
  temperature: number;
  season: 'Summer' | 'Winter' | 'Monsoon';
  daily_water_usage: number;
}

export interface ModelMetrics {
  rSquared: number;
  mae: number;
  rmse: number;
  trainingSamples: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface UserInputs {
  tankCapacity: number;
  householdSize: number;
  usagePattern: 'Low' | 'Moderate' | 'High';
  leakStatus: boolean;
  temperature: number;
  season: 'Summer' | 'Winter' | 'Monsoon';
}
