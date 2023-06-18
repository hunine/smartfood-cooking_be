import _ from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { In, Repository } from 'typeorm';
import { LevelService } from 'src/modules/level/level.service';
import { Level } from 'src/modules/level/entities';
import { Category } from 'src/modules/category/entities';
import { CategoryService } from 'src/modules/category/category.service';
import { CuisineService } from 'src/modules/cuisine/cuisine.service';
import { IngredientService } from '@app/ingredient/ingredient.service';
import { Cuisine } from 'src/modules/cuisine/entities';
import { RecipeProvider } from './recipe.provider';
import { Quantification } from '@app/quantification/entities';
import { RecipeStep } from '@app/recipe-step/entities';
import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class RecipeService {
  constructor(
    @Inject(RecipeProvider.REPOSITORY)
    private readonly repository: Repository<Recipe>,
    private readonly levelService: LevelService,
    private readonly categoryService: CategoryService,
    private readonly cuisineService: CuisineService,
    private readonly ingredientService: IngredientService,
  ) {}

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

    return resultRecipe;
  }

  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Recipe>> {
    return paginate(query, this.repository, {
      relations: ['level', 'category', 'cuisine', 'media'],
      sortableColumns: [
        'id',
        'name',
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
      },
    });
  }

  async findOneById(id: string): Promise<Recipe> {
    return this.repository.findOneOrFail({
      select: {
        id: true,
        name: true,
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
        media: true,
        recipeStep: true,
      },
      relations: [
        'level',
        'media',
        'cuisine',
        'category',
        'quantification',
        'quantification.ingredient',
        'recipeStep',
      ],
      where: { id },
      order: {
        recipeStep: {
          order: 'ASC',
        },
      },
    });
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

      return this.findOneById(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const recipe: Recipe = await this.findOneById(id);
      return this.repository.softRemove(recipe);
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      const recipes: Recipe[] = await this.repository.find({
        where: {
          id: In(ids),
        },
      });

      return this.repository.softRemove(recipes);
    } catch (error) {
      throw error;
    }
  }
}
