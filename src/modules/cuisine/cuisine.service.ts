import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';
import { Cuisine } from './entities';
import { In, Repository } from 'typeorm';
import { CuisineProvider } from './cuisine.provider';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { RecommenderServiceHelper } from 'src/helpers/recommender-service.helper';
import { RECOMMENDER_SERVICE_STATUS, REDIS_PREFIX } from 'src/common/constants';
import { Cache } from 'cache-manager';

@Injectable()
export class CuisineService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(CuisineProvider.REPOSITORY)
    private readonly repository: Repository<Cuisine>,
  ) {}

  private async updateRecommenderDataframe() {
    const result: any = await RecommenderServiceHelper.training();

    if (result.data.status === RECOMMENDER_SERVICE_STATUS.SUCCESS) {
      const key = `${REDIS_PREFIX.RECOMMENDER_RECIPES}*`;
      await this.cacheManager.del(key);
    }
  }

  async create(createCuisineDto: CreateCuisineDto): Promise<Cuisine> {
    const cuisine: Cuisine = this.repository.create(createCuisineDto);
    const newCuisine = await this.repository.save(cuisine);

    await this.updateRecommenderDataframe();

    return newCuisine;
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Cuisine>> {
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

  async findOneById(id: string): Promise<Cuisine> {
    return this.repository.findOneByOrFail({ id });
  }

  async update(id: string, updateCuisineDto: UpdateCuisineDto) {
    try {
      const updatedCuisine = await this.repository.save({
        id,
        ...updateCuisineDto,
      });

      await this.updateRecommenderDataframe();

      return updatedCuisine;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const cuisine: Cuisine = await this.findOneById(id);
      const removedCuisine = await this.repository.softRemove(cuisine);

      await this.updateRecommenderDataframe();

      return removedCuisine;
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      const cuisineArray: Cuisine[] = await this.repository.find({
        where: {
          id: In(ids),
        },
      });

      const removedCuisineArray = await this.repository.softRemove(
        cuisineArray,
      );

      await this.updateRecommenderDataframe();

      return removedCuisineArray;
    } catch (error) {
      throw error;
    }
  }
}
