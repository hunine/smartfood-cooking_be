import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { DiaryProvider } from '@app/diary/diary.provider';
import { LessThan, Repository } from 'typeorm';
import { Diary } from '@app/diary/entities';
import { CreateDiaryDto } from '@app/diary/dto/create-diary.dto';
import { RecipeService } from '@app/recipe/recipe.service';
import { IGetDiaryInterface } from './interfaces/get-diary.interface';
import { Meal } from '@app/meal/entities';
import { UserService } from '@app/user/user.service';
import { MealService } from '@app/meal/meal.service';
import { CreateDiaryExerciseDto } from './dto/create-diary-exercise.dto';
import { ExerciseService } from '@app/exercise/exercise.service';
import { ExercisesDiaries } from '@app/exercise/entities/exercises-diaries.entity';

@Injectable()
export class DiaryService {
  constructor(
    @Inject(DiaryProvider.REPOSITORY)
    private readonly repository: Repository<Diary>,
    private readonly mealRepository: MealService,
    private readonly exerciseService: ExerciseService,
    @Inject(forwardRef(() => RecipeService))
    private readonly recipeService: RecipeService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  private async createNewDiary(userId: string, date: string) {
    const { calories, carbs, protein, fat } =
      await this.userService.caculatorTotalCalories(userId);

    return this.repository.save({
      date,
      fat,
      carbs,
      protein,
      totalCalories: calories,
      user: {
        id: userId,
      },
    });
  }

  private async findOneDiary(userId: string, date: string) {
    return this.repository.findOne({
      where: {
        user: {
          id: userId,
        },
        date,
      },
    });
  }

  async getDiary(userId: string, date: string) {
    try {
      const returnData: IGetDiaryInterface = {
        date,
        totalCalories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        breakfast: [],
        lunch: [],
        dinner: [],
        exercises: [],
      };

      const isEnoughStat = await this.userService.checkUserStat(userId);

      if (!isEnoughStat) {
        throw new NotFoundException('Please update your profile');
      }

      const diary = await this.repository.findOne({
        where: {
          user: {
            id: userId,
          },
          date,
        },
        relations: [
          'user',
          'meals',
          'meals.recipe',
          'meals.recipe.media',
          'exercisesDiaries',
          'exercisesDiaries.exercise',
        ],
      });

      if (diary) {
        diary.meals.forEach((item) => {
          if (!returnData[item.typeOfMeal]) {
            returnData[item.typeOfMeal] = [];
          }
          returnData[item.typeOfMeal].push({
            id: item.id,
            recipe: item.recipe,
            kcal: item.kcal || 0,
            carbs: item.carbs || 0,
            protein: item.protein || 0,
            fat: item.fat || 0,
          });
        });

        diary.exercisesDiaries.forEach((item) => {
          returnData.exercises.push({
            id: item.id,
            name: item.exercise.name,
            calo: item.exercise.calo,
            minute: item.exercise.minute,
          });
        });

        returnData.totalCalories = diary.totalCalories;
        returnData.fat = diary.fat;
        returnData.protein = diary.protein;
        returnData.carbs = diary.carbs;
      } else {
        const recentDiary = await this.repository.findOne({
          where: {
            user: {
              id: userId,
            },
            date: LessThan(date),
          },
          order: {
            date: 'DESC',
          },
        });

        returnData.totalCalories = recentDiary.totalCalories;
      }

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
      const { dishes, typeOfMeal } = createDiaryDto;
      const recipeIds = [];
      const totalPeopleMapping = {};

      dishes.forEach((item) => {
        totalPeopleMapping[item.recipeId] = item.totalPeople;
        recipeIds.push(item.recipeId);
      });

      const recipes = await this.recipeService.findManyByIds(recipeIds);

      let diary = await this.findOneDiary(userId, date);

      if (!diary) {
        diary = await this.createNewDiary(userId, date);
      }

      let resultIds = [];

      await this.repository.manager.transaction(async (manager) => {
        const promiseArray = recipes.map(async (recipe) => {
          const nutrition = await this.recipeService.calculateRecipeNutrition(
            recipe.id,
          );

          return {
            recipe: {
              id: recipe.id,
            },
            diary: {
              id: diary.id,
            },
            typeOfMeal,
            totalPeople: totalPeopleMapping[recipe.id],
            ...nutrition,
          };
        });

        const meals = await Promise.all(promiseArray);

        const newMeals = await manager.save(Meal, meals);

        resultIds = newMeals.map((item) => item.id);
      });

      return this.mealRepository.findManyByIds(resultIds);
    } catch (error) {
      throw error;
    }
  }

  async createDiaryExercise(
    userId: string,
    date: string,
    createDiaryExerciseDto: CreateDiaryExerciseDto,
  ) {
    try {
      const { exerciseIds } = createDiaryExerciseDto;
      const exercises = await this.exerciseService.findManyByIds(exerciseIds);

      let diary = await this.findOneDiary(userId, date);

      if (!diary) {
        diary = await this.createNewDiary(userId, date);
      }

      const promiseArray = exercises.map(async (exercise) => {
        const exercisesDiaries = new ExercisesDiaries();
        exercisesDiaries.exercise = exercise;
        exercisesDiaries.diary = diary;

        await this.repository.manager.save(exercisesDiaries);
      });

      await Promise.all(promiseArray);

      return this.getDiary(userId, date);
    } catch (error) {
      throw error;
    }
  }

  async deleteRecipeInDiary(userId: string, mealId: string) {
    try {
      await this.repository.manager.transaction(async (manager) => {
        const meal = await manager.findOne(Meal, {
          where: {
            id: mealId,
            diary: {
              user: {
                id: userId,
              },
            },
          },
        });

        if (!meal) {
          throw new NotFoundException('Meal not found');
        }

        await manager.delete(Meal, mealId);
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteExerciseInDiary(userId: string, exerciseId: string) {
    try {
      await this.repository.manager.transaction(async (manager) => {
        const exercise = await manager.findOne(ExercisesDiaries, {
          where: {
            id: exerciseId,
            diary: {
              user: {
                id: userId,
              },
            },
          },
        });

        if (!exercise) {
          throw new NotFoundException('Exercise not found');
        }

        await manager.delete(ExercisesDiaries, exerciseId);
      });
    } catch (error) {
      throw error;
    }
  }
}
