import { CACHE_MANAGER, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';
import { In, Repository } from 'typeorm';
import { LevelProvider } from './level.provider';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { RecommenderServiceHelper } from 'src/helpers/recommender-service.helper';
import { REDIS_PREFIX } from 'src/common/constants/redis';
import { RECOMMENDER_SERVICE_STATUS } from 'src/common/constants';
import { Cache } from 'cache-manager';
import { Recipe } from '@app/recipe/entities';
import { RecipeService } from '@app/recipe/recipe.service';

@Injectable()
export class LevelService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(LevelProvider.REPOSITORY)
    private readonly repository: Repository<Level>,
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

  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const level: Level = this.repository.create(createLevelDto);
    const newLevel = await this.repository.save(level);

    await this.updateRecommenderDataframe();

    return newLevel;
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Level>> {
    return paginate(query, this.repository, {
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      select: ['id', 'name'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
      },
    });
  }

  async findOneById(id: string): Promise<Level> {
    try {
      return this.repository.findOneByOrFail({ id });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateLevelDto: UpdateLevelDto): Promise<Level> {
    try {
      const updatedLevel = await this.repository.save({
        id,
        ...updateLevelDto,
      });

      await this.updateRecommenderDataframe();

      return updatedLevel;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      let removedLevel: Level;

      await this.repository.manager.transaction(async (manager) => {
        const level: Level = await this.findOneById(id);
        const recipes: Recipe[] = await manager.find(Recipe, {
          where: {
            level: {
              id: level.id,
            },
          },
        });

        await this.recipeService.multipleRemove(
          recipes.map((recipe) => recipe.id),
        );
        removedLevel = await manager.softRemove(Level, level);
      });

      await this.updateRecommenderDataframe();

      return removedLevel;
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      let removedLevels: Level[] = [];

      await this.repository.manager.transaction(async (manager) => {
        const levels: Level[] = await this.repository.find({
          where: {
            id: In(ids),
          },
        });
        const recipes: Recipe[] = await manager.find(Recipe, {
          where: {
            level: {
              id: In(ids),
            },
          },
        });

        await this.recipeService.multipleRemove(
          recipes.map((recipe) => recipe.id),
        );
        removedLevels = await manager.softRemove(Level, levels);
      });

      await this.updateRecommenderDataframe();

      return removedLevels;
    } catch (error) {
      throw error;
    }
  }
}
