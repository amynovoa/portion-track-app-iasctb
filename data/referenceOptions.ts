
import { ReferenceOptions } from '@/types';

export const referenceOptions: ReferenceOptions = {
  protein: {
    title: 'Protein Options',
    tip: 'Aim for lean proteins to support muscle health and satiety.',
    options: [
      { name: 'Chicken breast', diet: 'omnivore' },
      { name: 'Salmon', diet: 'omnivore' },
      { name: 'Protein Powder', diet: 'omnivore' },
      { name: 'Lean beef', diet: 'omnivore' },
      { name: 'Eggs', diet: 'vegetarian' },
      { name: 'Tofu', diet: 'vegan' },
      { name: 'Lentils', diet: 'vegan' },
      { name: 'Black beans', diet: 'vegan' },
    ],
  },
  veggies: {
    title: 'Vegetable Options',
    tip: 'Fill half your plate with colorful vegetables for vitamins and fiber.',
    options: [
      { name: 'Broccoli', diet: 'vegan' },
      { name: 'Spinach', diet: 'vegan' },
      { name: 'Romaine / mixed greens', diet: 'vegan' },
      { name: 'Kale', diet: 'vegan' },
      { name: 'Carrots', diet: 'vegan' },
      { name: 'Bell peppers', diet: 'vegan' },
      { name: 'Tomatoes', diet: 'vegan' },
      { name: 'Zucchini', diet: 'vegan' },
      { name: 'Cauliflower', diet: 'vegan' },
      { name: 'Asparagus', diet: 'vegan' },
      { name: 'Green beans', diet: 'vegan' },
      { name: 'Brussels sprouts', diet: 'vegan' },
      { name: 'Cucumber', diet: 'vegan' },
      { name: 'Mushrooms', diet: 'vegan' },
    ],
  },
  fruit: {
    title: 'Fruit Options',
    tip: 'Choose whole fruits for natural sweetness and fiber.',
    options: [
      { name: 'Berries', diet: 'vegan' },
      { name: 'Apple', diet: 'vegan' },
      { name: 'Orange', diet: 'vegan' },
      { name: 'Banana', diet: 'vegan' },
      { name: 'Grapes', diet: 'vegan' },
    ],
  },
  wholeGrains: {
    title: 'Whole Grain Options',
    tip: 'Choose whole grains over refined grains for sustained energy.',
    options: [
      { name: 'Brown rice', diet: 'vegan' },
      { name: 'Quinoa', diet: 'vegan' },
      { name: 'Oats', diet: 'vegan' },
      { name: 'Whole-wheat pasta', diet: 'vegan' },
      { name: 'Corn tortillas', diet: 'vegan' },
    ],
  },
  fats: {
    title: 'Healthy Fat Options',
    tip: 'Include healthy fats for heart health and nutrient absorption.',
    options: [
      { name: 'Olive oil', diet: 'vegan' },
      { name: 'Avocado', diet: 'vegan' },
      { name: 'Olives', diet: 'vegan' },
      { name: 'Tahini', diet: 'vegan' },
      { name: 'Nut butter', diet: 'vegetarian' },
    ],
  },
  nutsSeeds: {
    title: 'Nuts & Seeds Options',
    tip: 'A small handful provides protein, healthy fats, and minerals.',
    options: [
      { name: 'Almonds', diet: 'vegan' },
      { name: 'Walnuts', diet: 'vegan' },
      { name: 'Pistachios', diet: 'vegan' },
      { name: 'Chia seeds', diet: 'vegan' },
      { name: 'Flax seeds', diet: 'vegan' },
    ],
  },
  legumes: {
    title: 'Legume Options',
    tip: 'Legumes are excellent sources of plant-based protein and fiber.',
    options: [
      { name: 'Lentils', diet: 'vegan' },
      { name: 'Chickpeas', diet: 'vegan' },
      { name: 'Black beans', diet: 'vegan' },
      { name: 'Kidney beans', diet: 'vegan' },
      { name: 'Hummus', diet: 'vegan' },
    ],
  },
  water: {
    title: 'Hydration',
    tip: 'Stay hydrated throughout the day. Each glass is about 8 oz.',
    options: [
      { name: 'Water', diet: 'vegan' },
      { name: 'Herbal tea', diet: 'vegan' },
      { name: 'Sparkling water', diet: 'vegan' },
    ],
  },
  alcohol: {
    title: 'Alcohol',
    tip: 'Limit alcohol consumption for better health outcomes. Maximum 2 servings per day.',
    options: [
      { name: 'Wine (5 oz)', diet: 'vegan' },
      { name: 'Beer (12 oz)', diet: 'vegan' },
      { name: 'Spirits (1.5 oz)', diet: 'vegan' },
    ],
  },
  dairy: {
    title: 'Dairy Options',
    tip: 'Choose dairy or plant-based alternatives for calcium and protein.',
    options: [
      { name: 'Greek yogurt', diet: 'vegetarian' },
      { name: 'Cottage cheese', diet: 'vegetarian' },
      { name: 'Regular yogurt', diet: 'vegetarian' },
      { name: 'Milk', diet: 'vegetarian' },
      { name: 'Cheese', diet: 'vegetarian' },
      { name: 'Kefir', diet: 'vegetarian' },
      { name: 'Plant-based yogurt', diet: 'vegan' },
      { name: 'Almond milk', diet: 'vegan' },
      { name: 'Soy milk', diet: 'vegan' },
      { name: 'Oat milk', diet: 'vegan' },
      { name: 'Plant-based cheese', diet: 'vegan' },
    ],
  },
};
