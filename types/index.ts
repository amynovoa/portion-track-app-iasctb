
export type Goal = 'Lose weight' | 'Maintain' | 'Gain muscle' | 'Eat healthier';
export type DietStyle = 'omnivore' | 'vegetarian' | 'vegan';
export type Sex = 'Male' | 'Female' | 'Prefer not to say';
export type Size = 'Small' | 'Medium' | 'Large';

export interface PortionPlan {
  protein: number;
  veggies: number;
  fruit: number;
  wholeGrains: number;
  legumes: number;
  fats: number;
  nutsSeeds: number;
  alcohol: number;
  water: number;
}

export interface User {
  goal: Goal;
  dietStyle: DietStyle;
  resetTime: string;
  remindersOn: boolean;
  reminderTimes: string[];
  sex?: Sex;
  currentWeight?: number;
  targetWeight?: number;
  portionPlan?: PortionPlan;
}

export interface DailyTargets {
  date: string;
  protein: number;
  veggies: number;
  fruit: number;
  wholeGrains: number;
  fats: number;
  nutsSeeds: number;
  legumes: number;
  water: number;
  alcohol: number;
  dairy: number;
}

export interface DailyLog {
  date: string;
  protein: number;
  veggies: number;
  fruit: number;
  wholeGrains: number;
  fats: number;
  nutsSeeds: number;
  legumes: number;
  water: number;
  alcohol: number;
  dairy: number;
}

export interface MetricWeight {
  date: string;
  value: number;
}

export type FoodGroup = 
  | 'protein'
  | 'veggies'
  | 'fruit'
  | 'wholeGrains'
  | 'fats'
  | 'nutsSeeds'
  | 'legumes'
  | 'water'
  | 'alcohol'
  | 'dairy';

export interface FoodOption {
  name: string;
  diet: 'omnivore' | 'vegetarian' | 'vegan';
}

export interface ReferenceOptions {
  [key: string]: {
    title: string;
    tip: string;
    options: FoodOption[];
    portionSizes?: string[];
  };
}
