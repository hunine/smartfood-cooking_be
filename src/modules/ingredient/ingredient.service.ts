import { CACHE_MANAGER, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { IngredientProvider } from './ingredient.provider';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { translateHelper } from 'src/helpers';
import { DateTimeHelper } from 'src/helpers/datetime.helper';
import { RecommenderServiceHelper } from 'src/helpers/recommender-service.helper';
import { REDIS_PREFIX } from 'src/common/constants/redis';
import { Cache } from 'cache-manager';
import { RECOMMENDER_SERVICE_STATUS } from 'src/common/constants';
import { RecipeService } from '@app/recipe/recipe.service';
import { Recipe } from '@app/recipe/entities';
import { Quantification } from '@app/quantification/entities';

@Injectable()
export class IngredientService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(IngredientProvider.REPOSITORY)
    private readonly repository: Repository<Ingredient>,
    @Inject(forwardRef(() => RecipeService))
    private readonly recipeService: RecipeService,
  ) {}

  private async updateRecommenderDataframe() {
    const result: any = await RecommenderServiceHelper.training();

    if (result.data.status === RECOMMENDER_SERVICE_STATUS.SUCCESS) {
      const key = `${REDIS_PREFIX.RECOMMENDER_RECIPES}*`;
      await this.cacheManager.del(key);
    }
  }

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const slug = await translateHelper.translate(createIngredientDto.name);
    const ingredient: Ingredient = this.repository.create({
      ...createIngredientDto,
      slug,
    });
    return this.repository.save(ingredient);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Ingredient>> {
    return paginate(query, this.repository, {
      relations: ['media'],
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['updatedAt', 'DESC']],
      searchableColumns: ['name'],
      select: [
        'id',
        'name',
        'slug',
        'kcal',
        'carbs',
        'fat',
        'protein',
        'media.id',
        'media.url',
        'updatedAt',
      ],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
      },
    });
  }

  async findAllWithoutPagination(): Promise<Ingredient[]> {
    return this.repository.find({});
  }

  async findOneById(id: string): Promise<Ingredient> {
    return this.repository.findOneByOrFail({ id });
  }

  async findMultipleByIds(ids: string[]): Promise<Ingredient[]> {
    return this.repository.findBy({
      id: In(ids),
    });
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    try {
      const data = await this.repository.save({
        id,
        ...updateIngredientDto,
      });

      await this.updateRecommenderDataframe();

      return data;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      let removedIngredient: Ingredient;

      await this.repository.manager.transaction(async (manager) => {
        const ingredient: Ingredient = await this.findOneById(id);
        const recipes: Recipe[] = await manager.find(Recipe, {
          where: {
            quantification: {
              ingredient: {
                id: ingredient.id,
              },
            },
          },
        });
        const quantificationArray: Quantification[] = await manager.find(
          Quantification,
          {
            where: {
              ingredient: {
                id: ingredient.id,
              },
            },
          },
        );

        await this.recipeService.multipleRemove(
          recipes.map((recipe) => recipe.id),
        );
        await manager.softRemove(Quantification, quantificationArray);
        removedIngredient = await manager.softRemove(Ingredient, ingredient);
      });

      await this.updateRecommenderDataframe();

      return removedIngredient;
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      let removedIngredients: Ingredient[] = [];

      await this.repository.manager.transaction(async (manager) => {
        const ingredients: Ingredient[] = await this.repository.find({
          where: {
            id: In(ids),
          },
        });
        const recipes: Recipe[] = await manager.find(Recipe, {
          where: {
            quantification: {
              ingredient: {
                id: In(ids),
              },
            },
          },
        });
        const quantificationArray: Quantification[] = await manager.find(
          Quantification,
          {
            where: {
              ingredient: {
                id: In(ids),
              },
            },
          },
        );

        await this.recipeService.multipleRemove(
          recipes.map((recipe) => recipe.id),
        );
        await manager.softRemove(Quantification, quantificationArray);
        removedIngredients = await this.repository.softRemove(ingredients);
      });

      await this.updateRecommenderDataframe();

      return removedIngredients;
    } catch (error) {
      throw error;
    }
  }

  async countAll() {
    try {
      const totalIngredients = await this.repository.count();
      const newIngredientsLastWeek = await this.repository.count({
        where: {
          createdAt: MoreThanOrEqual(await DateTimeHelper.getLastWeeksDate()),
        },
      });

      return {
        totalIngredients,
        newIngredientsLastWeek,
      };
    } catch (error) {
      throw error;
    }
  }
}
