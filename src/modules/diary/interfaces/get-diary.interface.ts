import { Recipe } from '@app/recipe/entities';

interface DiaryItem {
  id: string;
  recipe: Recipe;
}

export interface IGetDiaryInterface {
  date: string;
  totalCalories: number;
  breakfast?: DiaryItem[];
  lunch?: DiaryItem[];
  dinner?: DiaryItem[];
}
