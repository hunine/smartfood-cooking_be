import { Recipe } from '@app/recipe/entities';

interface Meal {
  id: string;
  recipe: Recipe;
}

export interface IGetDiaryInterface {
  date: string;
  totalCalories: number;
  breakfast?: Meal[];
  lunch?: Meal[];
  dinner?: Meal[];
}
