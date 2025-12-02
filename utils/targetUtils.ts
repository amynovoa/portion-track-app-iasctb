
import { Goal, DailyTargets, Sex, Size, PortionPlan } from '@/types';
import { getTodayDate } from './dateUtils';

export function getDefaultTargets(goal: Goal): Omit<DailyTargets, 'date'> {
  // Legacy function for backward compatibility
  switch (goal) {
    case 'Lose weight':
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
        dairy: 2,
      };
    case 'Maintain':
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
        dairy: 2,
      };
    case 'Gain muscle':
      return {
        protein: 5,
        veggies: 4,
        fruit: 2,
        wholeGrains: 5,
        fats: 3,
        nutsSeeds: 1,
        legumes: 1,
        water: 9,
        alcohol: 2,
        dairy: 2,
      };
    case 'Eat healthier':
      return {
        protein: 4,
        veggies: 5,
        fruit: 2,
        wholeGrains: 4,
        fats: 3,
        nutsSeeds: 1,
        legumes: 1,
        water: 8,
        alcohol: 2,
        dairy: 2,
      };
  }
}

export function createDailyTargets(goal: Goal): DailyTargets {
  return {
    date: getTodayDate(),
    ...getDefaultTargets(goal),
  };
}

// New portion plan calculation logic
export function getSizeCategory(sex: Sex, currentWeight: number): Size {
  if (sex === 'Male') {
    if (currentWeight < 170) return 'Small';
    if (currentWeight <= 209) return 'Medium';
    return 'Large';
  } else {
    // Female or Prefer not to say
    if (currentWeight < 150) return 'Small';
    if (currentWeight <= 189) return 'Medium';
    return 'Large';
  }
}

export function getBaseTemplate(sex: Sex, size: Size): PortionPlan {
  const templates = {
    'Female/Prefer Not': {
      Small: { protein: 3, veggies: 4, fruit: 2, wholeGrains: 2, legumes: 1, fats: 2, nutsSeeds: 1, alcohol: 2, water: 8 },
      Medium: { protein: 4, veggies: 4, fruit: 2, wholeGrains: 3, legumes: 1, fats: 3, nutsSeeds: 1, alcohol: 2, water: 8 },
      Large: { protein: 5, veggies: 4, fruit: 2, wholeGrains: 4, legumes: 1, fats: 3, nutsSeeds: 1, alcohol: 2, water: 9 },
    },
    Male: {
      Small: { protein: 4, veggies: 4, fruit: 2, wholeGrains: 3, legumes: 1, fats: 3, nutsSeeds: 1, alcohol: 2, water: 8 },
      Medium: { protein: 5, veggies: 4, fruit: 2, wholeGrains: 4, legumes: 1, fats: 3, nutsSeeds: 1, alcohol: 2, water: 9 },
      Large: { protein: 6, veggies: 4, fruit: 2, wholeGrains: 5, legumes: 1, fats: 3, nutsSeeds: 1, alcohol: 2, water: 10 },
    },
  };

  return templates[sex === 'Male' ? 'Male' : 'Female/Prefer Not'][size];
}

export function calculatePortionPlan(
  goal: Goal,
  sex: Sex,
  currentWeight: number,
  targetWeight?: number
): PortionPlan {
  console.log('=== Calculating Portion Plan ===');
  console.log('Goal:', goal);
  console.log('Sex:', sex);
  console.log('Current Weight:', currentWeight);
  console.log('Target Weight:', targetWeight);

  const size = getSizeCategory(sex, currentWeight);
  console.log('Size Category:', size);

  let plan = { ...getBaseTemplate(sex, size) };
  console.log('Base Template:', plan);

  const diff = targetWeight ? currentWeight - targetWeight : 0;
  console.log('Weight Difference:', diff);

  switch (goal) {
    case 'Lose weight':
      if (diff >= 30) {
        // Strong weight loss
        console.log('Applying strong weight loss adjustments');
        plan.veggies += 2;
        plan.wholeGrains = Math.max(1, plan.wholeGrains - 1);
        if (plan.fats > 2) plan.fats -= 1;
        plan.alcohol = 1;
      } else {
        // Mild weight loss
        console.log('Applying mild weight loss adjustments');
        plan.veggies += 1;
        plan.wholeGrains = Math.max(1, plan.wholeGrains - 1);
        if (plan.fats > 2) plan.fats -= 1;
        plan.alcohol = 1;
      }
      break;

    case 'Maintain':
      console.log('Maintain - using base values');
      plan.alcohol = 2;
      break;

    case 'Gain muscle':
      console.log('Applying gain muscle adjustments');
      plan.protein += 1;
      if (size === 'Medium' || size === 'Large') {
        plan.wholeGrains += 1;
      }
      // Cap alcohol at 2 for initial calculation
      plan.alcohol = 2;
      break;

    case 'Eat healthier':
      console.log('Applying eat healthier adjustments');
      plan.veggies += 1;
      plan.alcohol = 2;
      break;
  }

  console.log('Final Portion Plan:', plan);
  return plan;
}

export function portionPlanToDailyTargets(plan: PortionPlan): DailyTargets {
  return {
    date: getTodayDate(),
    protein: plan.protein,
    veggies: plan.veggies,
    fruit: plan.fruit,
    wholeGrains: plan.wholeGrains,
    fats: plan.fats,
    nutsSeeds: plan.nutsSeeds,
    legumes: plan.legumes,
    water: plan.water,
    alcohol: plan.alcohol,
    dairy: 2, // Default dairy value
  };
}
