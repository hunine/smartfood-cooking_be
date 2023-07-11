import _ from 'lodash';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { FindManyOptions, In, MoreThanOrEqual, Repository } from 'typeorm';
import { LevelService } from 'src/modules/level/level.service';
import { Level } from 'src/modules/level/entities';
import { Category } from 'src/modules/category/entities';
import { CategoryService } from 'src/modules/category/category.service';
import { CuisineService } from 'src/modules/cuisine/cuisine.service';
import { IngredientService } from '@app/ingredient/ingredient.service';
import { CookingHistoryService } from '@app/cooking-history/cooking-history.service';
import { Cuisine } from 'src/modules/cuisine/entities';
import { RecipeProvider } from './recipe.provider';
import { Quantification } from '@app/quantification/entities';
import { RecipeStep } from '@app/recipe-step/entities';
import { Cache } from 'cache-manager';

import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { HttpHelper, NutritionHelper } from 'src/helpers';
import { RECOMMENDER_SERVICE } from '@config/env';
import { DateTimeHelper } from 'src/helpers/datetime.helper';
import { REDIS_PREFIX } from 'src/common/constants/redis';
import { RecommenderServiceHelper } from 'src/helpers/recommender-service.helper';
import { RECOMMENDER_SERVICE_STATUS } from 'src/common/constants';
import { CONVERT_GRAM_UNIT } from 'src/common/constants/nutrition';
import { Meal } from '@app/meal/entities';

@Injectable()
export class RecipeService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(RecipeProvider.REPOSITORY)
    private readonly repository: Repository<Recipe>,
    private readonly levelService: LevelService,
    private readonly categoryService: CategoryService,
    private readonly cuisineService: CuisineService,
    private readonly ingredientService: IngredientService,
    private readonly cookingHistoryService: CookingHistoryService,
  ) {}

  private async updateRecommenderDataframe() {
    const result: any = await RecommenderServiceHelper.training();

    if (result.data.status === RECOMMENDER_SERVICE_STATUS.SUCCESS) {
      const key = `${REDIS_PREFIX.RECOMMENDER_RECIPES}*`;
      await this.cacheManager.del(key);
    }
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    let resultRecipe: Recipe;

    await this.repository.manager.transaction(async (manager) => {
      const level: Level = await this.levelService.findOneById(
        createRecipeDto.levelId,
      );
      const category: Category = await this.categoryService.findOneById(
        createRecipeDto.categoryId,
      );
      const cuisine: Cuisine = await this.cuisineService.findOneById(
        createRecipeDto.cuisineId,
      );

      // Create recipe
      const recipe: Recipe = this.repository.create({
        ...createRecipeDto,
        level,
        cuisine,
        category,
      });

      resultRecipe = await manager.save(recipe);

      // Create quantification
      const quantificationArray: Quantification[] =
        createRecipeDto.ingredients.map((ingredient) => {
          return manager.create(Quantification, {
            ...ingredient,
            recipe: resultRecipe,
          });
        });

      await manager.save(quantificationArray);

      // Create recipe steps
      const steps: RecipeStep[] = createRecipeDto.steps.map((step) => {
        return manager.create(RecipeStep, {
          ...step,
          recipe: resultRecipe,
        });
      });

      await manager.save(steps);
    });

    await this.updateRecommenderDataframe();

    return resultRecipe;
  }

  async findAll(
    @Paginate() query: PaginateQuery,
    getNutrition: boolean,
  ): Promise<Paginated<any>> {
    const data = await paginate(query, this.repository, {
      relations: ['level', 'category', 'cuisine', 'media'],
      sortableColumns: [
        'id',
        'name',
        'rating',
        'level.name',
        'category.name',
        'cuisine.name',
      ],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      select: [
        'id',
        'name',
        'rating',
        'description',
        'level.id',
        'level.name',
        'category.id',
        'category.name',
        'cuisine.id',
        'cuisine.name',
        'media.id',
        'media.url',
        'deletedAt',
      ],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterOperator.ILIKE, FilterSuffix.NOT],
        'level.name': [
          FilterOperator.EQ,
          FilterOperator.ILIKE,
          FilterSuffix.NOT,
        ],
        'category.name': [
          FilterOperator.EQ,
          FilterOperator.ILIKE,
          FilterSuffix.NOT,
        ],
        'cuisine.name': [
          FilterOperator.EQ,
          FilterOperator.ILIKE,
          FilterSuffix.NOT,
        ],
      },
    });

    if (!getNutrition) {
      return data;
    }

    const promiseArray = data.data.map(async (recipe) => {
      const nutrition = await this.calculateRecipeNutrition(recipe.id);

      return {
        recipe,
        ...nutrition,
      };
    });

    return {
      ...data,
      data: await Promise.all(promiseArray),
    };
  }

  async findManyByIds(ids: string[]): Promise<Recipe[]> {
    return this.repository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findOneById(id: string): Promise<any> {
    const recipe = await this.repository.findOneOrFail({
      select: {
        id: true,
        name: true,
        rating: true,
        description: true,
        level: {
          id: true,
          name: true,
        },
        category: {
          id: true,
          name: true,
        },
        cuisine: {
          id: true,
          name: true,
        },
        quantification: {
          id: true,
          value: true,
          unit: true,
          ingredient: {
            id: true,
            name: true,
          },
        },
        media: {
          id: true,
          url: true,
        },
        recipeStep: {
          id: true,
          content: true,
          order: true,
          media: {
            id: true,
            url: true,
          },
        },
        deletedAt: true,
      },
      relations: [
        'level',
        'media',
        'cuisine',
        'category',
        'quantification',
        'quantification.ingredient',
        'recipeStep',
        'recipeStep.media',
      ],
      where: { id },
      order: {
        recipeStep: {
          order: 'ASC',
        },
      },
    });

    const recipeNutrition = await this.calculateRecipeNutrition(recipe.id);

    return { ...recipe, ...recipeNutrition };
  }

  async getRecipeToCook(id: string, userEmail = ''): Promise<Recipe> {
    try {
      const recipe = await this.findOneById(id);

      if (recipe && userEmail) {
        await this.cookingHistoryService.create({
          userEmail,
          recipeId: recipe.id,
        });
      }

      return recipe;
    } catch (error) {
      throw new NotFoundException('Recipe not found');
    }
  }

  async findByIngredient(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Recipe>> {
    return paginate(query, this.repository, {
      relations: {
        level: true,
        category: true,
        cuisine: true,
        media: true,
        quantification: {
          ingredient: true,
        },
      },
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      select: [
        'id',
        'name',
        'rating',
        'description',
        'level.id',
        'level.name',
        'category.id',
        'category.name',
        'cuisine.id',
        'cuisine.name',
        'media.id',
        'media.url',
      ],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterOperator.ILIKE, FilterSuffix.NOT],
        'level.name': [
          FilterOperator.EQ,
          FilterOperator.ILIKE,
          FilterSuffix.NOT,
        ],
        'category.name': [
          FilterOperator.EQ,
          FilterOperator.ILIKE,
          FilterSuffix.NOT,
        ],
        'cuisine.name': [
          FilterOperator.EQ,
          FilterOperator.ILIKE,
          FilterSuffix.NOT,
        ],
        'quantification.ingredient.id': [
          FilterOperator.IN,
          FilterOperator.CONTAINS,
        ],
        'quantification.ingredient.slug': [
          FilterOperator.IN,
          FilterOperator.CONTAINS,
        ],
      },
    });
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    try {
      this.repository.manager.transaction(async (manager) => {
        const recipe: Recipe = await this.findOneById(id);
        const level: Level = await this.levelService.findOneById(
          updateRecipeDto.levelId,
        );
        const category: Category = await this.categoryService.findOneById(
          updateRecipeDto.categoryId,
        );
        const cuisine: Cuisine = await this.cuisineService.findOneById(
          updateRecipeDto.cuisineId,
        );
        const ingredients = await this.ingredientService.findMultipleByIds(
          updateRecipeDto.ingredients.map((item) => item.ingredientId),
        );
        const ingredientMapping = new Map();
        ingredients.forEach((ingredient) => {
          ingredientMapping.set(ingredient.id, ingredient);
        });

        // Update quantification
        const existQuantification = await manager.find(Quantification, {
          where: {
            recipe: {
              id,
            },
          },
        });
        const quantificationArray = updateRecipeDto.ingredients.map(
          (ingredient) => ({
            ...ingredient,
            recipe,
            ingredient: ingredientMapping.get(ingredient.ingredientId),
          }),
        );
        const quantificationRemoved = _.difference(
          existQuantification.map((item) => item.id),
          quantificationArray.map((item) => item.id),
        );

        await manager.upsert(Quantification, quantificationArray, ['id']);
        if (quantificationRemoved.length) {
          await manager.softDelete(Quantification, quantificationRemoved);
        }

        // Update recipe steps
        const existSteps = await manager.find(RecipeStep, {
          where: {
            recipe: {
              id,
            },
          },
        });
        const steps: RecipeStep[] = updateRecipeDto.steps.map((step) => {
          return manager.create(RecipeStep, {
            ...step,
            recipe,
          });
        });
        const stepsRemoved = _.difference(
          existSteps.map((item) => item.id),
          steps.map((item) => item.id),
        );

        await manager.upsert(RecipeStep, steps, ['id']);
        if (stepsRemoved.length) {
          await manager.softDelete(RecipeStep, stepsRemoved);
        }

        // Update recipe
        await manager.save(Recipe, {
          id,
          level,
          cuisine,
          category,
          name: updateRecipeDto.name,
          description: updateRecipeDto.description,
        });
      });

      await this.updateRecommenderDataframe();

      return this.findOneById(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      let removedRecipe: Recipe;

      await this.repository.manager.transaction(async (manager) => {
        const recipe: Recipe = await manager.findOneOrFail(Recipe, {
          where: {
            id,
          },
        });
        const meals: Meal[] = await manager.find(Meal, {
          where: {
            recipe: {
              id: recipe.id,
            },
          },
        });

        await manager.softRemove(Meal, meals);
        removedRecipe = await manager.softRemove(Recipe, recipe);
      });

      await this.updateRecommenderDataframe();

      return removedRecipe;
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      let removedRecipes: Recipe[] = [];

      await this.repository.manager.transaction(async (manager) => {
        const recipes: Recipe[] = await manager.find(Recipe, {
          where: {
            id: In(ids),
          },
        });
        const meals: Meal[] = await manager.find(Meal, {
          where: {
            recipe: {
              id: In(ids),
            },
          },
        });

        await manager.softRemove(Meal, meals);
        removedRecipes = await manager.softRemove(Recipe, recipes);
      });

      await this.updateRecommenderDataframe();

      return removedRecipes;
    } catch (error) {
      throw error;
    }
  }

  async findRecommendedRecipes(userEmail) {
    try {
      const key = `${REDIS_PREFIX.RECOMMENDER_RECIPES}${userEmail}`;
      const recommendRecipes = await this.cacheManager.get(key);

      if (recommendRecipes) {
        return recommendRecipes;
      } else {
        const cookingHistory =
          await this.cookingHistoryService.findHistoryByUser(userEmail);
        const recipeIds = cookingHistory.map((item) => item.recipeId);
        const options: FindManyOptions<Recipe> = {
          select: ['name'],
        };
        if (recipeIds.length) {
          options.where = {
            id: In(recipeIds),
          };
        } else {
          options.take = 5;
          options.skip = Math.floor(
            Math.random() * (await this.repository.count()),
          );
        }
        const recipes = await this.repository.find(options);
        const data = {
          user_recipes: recipes.map((recipe) => recipe.name),
        };
        const url = `${RECOMMENDER_SERVICE.URL}/recommend`;
        const recommendResult: any = await HttpHelper.post(url, data, null, {
          headers: {
            authorization: RECOMMENDER_SERVICE.API_KEY,
          },
        });
        const promiseArray = recommendResult.data.map((recipeName) => {
          return this.repository.findOne({
            where: { name: recipeName },
            relations: {
              level: true,
              category: true,
              cuisine: true,
              media: true,
            },
          });
        });

        const recommendRecipes = await Promise.all(promiseArray);
        await this.cacheManager.set(key, recommendRecipes);

        return recommendRecipes;
      }
    } catch (error) {
      throw error;
    }
  }

  async countAll() {
    try {
      const totalRecipes = await this.repository.count();
      const newRecipesLastWeek = await this.repository.count({
        where: {
          createdAt: MoreThanOrEqual(await DateTimeHelper.getLastWeeksDate()),
        },
      });

      return {
        totalRecipes,
        newRecipesLastWeek,
      };
    } catch (error) {
      throw error;
    }
  }

  async calculateRecipeNutrition(id: string) {
    const recipeNutrition = await this.repository.findOneOrFail({
      select: {
        id: true,
        quantification: {
          id: true,
          value: true,
          unit: true,
          ingredient: {
            id: true,
            name: true,
            fat: true,
            kcal: true,
            carbs: true,
            protein: true,
          },
        },
      },
      relations: [
        'quantification',
        'quantification.ingredient',
        'quantification.ingredient',
        'quantification.ingredient.listAverageWeight',
      ],
      where: { id },
    });

    let totalKcal = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalProtein = 0;

    recipeNutrition.quantification.forEach((quantification) => {
      let data = { kcal: 0, fat: 0, carbs: 0, protein: 0 };
      let weight = quantification.value;

      if (Object.keys(CONVERT_GRAM_UNIT).includes(quantification.unit)) {
        weight = CONVERT_GRAM_UNIT[quantification.unit] * quantification.value;

        data = NutritionHelper.calculateNutritionByWeight(
          quantification.ingredient,
          weight,
        );
      } else {
        const listAverageWeight = quantification.ingredient.listAverageWeight;

        if (listAverageWeight) {
          const averageWeight = listAverageWeight.find(
            (item) => item.unit === quantification.unit,
          );

          if (averageWeight) {
            data = NutritionHelper.calculateNutritionByWeight(
              quantification.ingredient,
              averageWeight.gram,
            );
          }
        }
      }
      totalKcal += data.kcal;
      totalFat += data.fat;
      totalCarbs += data.carbs;
      totalProtein += data.protein;
    });

    return {
      kcal: Number(totalKcal.toFixed(2)),
      fat: Number(totalFat.toFixed(2)),
      carbs: Number(totalCarbs.toFixed(2)),
      protein: Number(totalProtein.toFixed(2)),
    };
  }
}
