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
            recipeId: resultRecipe.id,
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
    // return this.repository.find({
    //   relations: ['level', 'category', 'cuisine', 'media'],
    // });
    return paginate(query, this.repository, {
      relations: ['level', 'category', 'cuisine', 'media'],
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
        name: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async findOneById(id: string): Promise<Recipe> {
    return this.repository.findOneOrFail({
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

  async findByIngredientIds(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    return this.repository.find({
      relations: [
        'level',
        'category',
        'cuisine',
        'quantification',
        'quantification.ingredient',
      ],
      where: {
        quantification: {
          ingredient: {
            id: In(ids),
          },
        },
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

        // Update quantification
        const quantificationArray = updateRecipeDto.ingredients.map(
          (ingredient) => ({
            ...ingredient,
            recipeId: id,
          }),
        );

        await manager.save(Quantification, quantificationArray);

        // Update recipe steps
        const steps: RecipeStep[] = updateRecipeDto.steps.map((step) => {
          return manager.create(RecipeStep, {
            ...step,
            recipe,
          });
        });

        await manager.save(steps);

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
