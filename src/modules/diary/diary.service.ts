import { Inject, Injectable } from '@nestjs/common';
import { DiaryProvider } from '@app/diary/diary.provider';
import { Repository } from 'typeorm';
import { Diary } from '@app/diary/entities';
import { CreateDiaryDto } from '@app/diary/dto/create-diary.dto';
import { RecipeService } from '@app/recipe/recipe.service';
import { IGetDiaryInterface } from './interfaces/get-diary.interface';

@Injectable()
export class DiaryService {
  constructor(
    @Inject(DiaryProvider.REPOSITORY)
    private readonly repository: Repository<Diary>,
    private readonly recipeService: RecipeService,
  ) {}

  async getDiary(userId: string, date: string) {
    try {
      const returnData: IGetDiaryInterface = {
        date,
        totalCalories: 0,
        breakfast: [],
        lunch: [],
        dinner: [],
      };
      const diary = await this.repository.find({
        where: {
          user: {
            id: userId,
          },
          date,
        },
        relations: ['recipe'],
      });

      diary.forEach((item) => {
        if (!returnData[item.typeOfMeal]) {
          returnData[item.typeOfMeal] = [];
        }

        returnData[item.typeOfMeal].push({
          id: item.id,
          recipe: item.recipe,
        });
      });

      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async createDiary(
    userId: string,
    date: string,
    createDiaryDto: CreateDiaryDto,
  ) {
    try {
      const { recipeIds, typeOfMeal } = createDiaryDto;
      const recipes = await this.recipeService.findManyByIds(recipeIds);
      const diaries = recipes.map((recipe) => ({
        date,
        recipe: {
          id: recipe.id,
        },
        user: {
          id: userId,
        },
        typeOfMeal,
      }));

      return this.repository.save(diaries);
    } catch (error) {
      throw error;
    }
  }

  async deleteRecipeInDiary(userId: string, id: string) {
    try {
      return this.repository.delete({
        id,
        user: {
          id: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
