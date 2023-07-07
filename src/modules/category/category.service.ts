import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { In, Repository } from 'typeorm';
import { Category } from './entities';
import { CategoryProvider } from './category.provider';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { Cache } from 'cache-manager';
import { RecommenderServiceHelper } from 'src/helpers/recommender-service.helper';
import { RECOMMENDER_SERVICE_STATUS, REDIS_PREFIX } from 'src/common/constants';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(CategoryProvider.REPOSITORY)
    private readonly repository: Repository<Category>,
  ) {}

  private async updateRecommenderDataframe() {
    const result: any = await RecommenderServiceHelper.training();

    if (result.data.status === RECOMMENDER_SERVICE_STATUS.SUCCESS) {
      const key = `${REDIS_PREFIX.RECOMMENDER_RECIPES}*`;
      await this.cacheManager.del(key);
    }
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category: Category = this.repository.create(createCategoryDto);
    const newCategory = await this.repository.save(category);

    await this.updateRecommenderDataframe();

    return newCategory;
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Category>> {
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

  async findOneById(id: string): Promise<Category> {
    return this.repository.findOneByOrFail({ id });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategories = await this.repository.save({
        id,
        ...updateCategoryDto,
      });

      await this.updateRecommenderDataframe();

      return updatedCategories;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const category: Category = await this.findOneById(id);
      const removedCategory = await this.repository.softRemove(category);

      await this.updateRecommenderDataframe();

      return removedCategory;
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      const categories: Category[] = await this.repository.find({
        where: {
          id: In(ids),
        },
      });
      const removedCategories = await this.repository.softRemove(categories);

      await this.updateRecommenderDataframe();

      return removedCategories;
    } catch (error) {
      throw error;
    }
  }
}
