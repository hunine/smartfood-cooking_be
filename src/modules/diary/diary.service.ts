import { Inject, Injectable } from '@nestjs/common';
import { DiaryProvider } from '@app/diary/diary.provider';
import { Repository } from 'typeorm';
import { Diary } from '@app/diary/entities';
import { CreateDiaryDto } from '@app/diary/dto/create-diary.dto';
import { RecipeService } from '@app/recipe/recipe.service';
import { UpdateDiaryDto } from '@app/diary/dto/update-diary.dto';

@Injectable()
export class DiaryService {
  constructor(
    @Inject(DiaryProvider.REPOSITORY)
    private readonly repository: Repository<Diary>,
    private readonly recipeService: RecipeService,
  ) {}

  async getDiary(userId: string, date: string) {
    try {
      return this.repository.find({
        where: {
          user: {
            id: userId,
          },
          date,
        },
        relations: ['recipe'],
      });
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

  async updateDiary(
    userId: string,
    date: string,
    updateDiaryDto: UpdateDiaryDto,
  ) {
    try {
      const { recipeIds, typeOfMeal } = updateDiaryDto;

      this.repository.manager.transaction(async (manager) => {
        await manager.delete(Diary, {
          user: {
            id: userId,
          },
          date,
        });

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

        await manager.save(Diary, diaries);
      });
    } catch (error) {
      throw error;
    }
  }
}
