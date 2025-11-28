
import { Goal, DailyTargets } from '@/types';
import { getTodayDate } from './dateUtils';

export function getDefaultTargets(goal: Goal): Omit<DailyTargets, 'date'> {
  switch (goal) {
    case 'weight_loss':
      return {
        protein: 4,
        veggies: 5,
        fruit: 2,
        wholeGrains: 3,
        fats: 2,
        nutsSeeds: 1,
        legumes: 1,
        water: 8,
        alcohol: 1,
        dairy: 0,
      };
    case 'maintenance':
      return {
        protein: 4,
        veggies: 4,
        fruit: 2,
        wholeGrains: 4,
        fats: 3,
        nutsSeeds: 1,
        legumes: 1,
        water: 8,
        alcohol: 1,
        dairy: 1,
      };
    case 'heart_health':
      return {
        protein: 3,
        veggies: 6,
        fruit: 2,
        wholeGrains: 4,
        fats: 2,
        nutsSeeds: 1,
        legumes: 2,
        water: 8,
        alcohol: 1,
        dairy: 0,
      };
  }
}

export function createDailyTargets(goal: Goal): DailyTargets {
  return {
    date: getTodayDate(),
    ...getDefaultTargets(goal),
  };
}
