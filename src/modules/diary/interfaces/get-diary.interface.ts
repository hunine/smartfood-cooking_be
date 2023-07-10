import { Recipe } from '@app/recipe/entities';

interface Meal {
  id: string;
  recipe: Recipe;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface IGetDiaryInterface {
  date: string;
  totalCalories: number;
  fat: number;
  carbs: number;
  protein: number;
  breakfast?: Meal[];
  lunch?: Meal[];
  dinner?: Meal[];
}
