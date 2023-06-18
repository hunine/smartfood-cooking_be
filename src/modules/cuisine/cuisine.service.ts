import { Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class CuisineService {
  constructor(
    @Inject(CuisineProvider.REPOSITORY)
    private readonly repository: Repository<Cuisine>,
  ) {}

  async create(createCuisineDto: CreateCuisineDto): Promise<Cuisine> {
    const cuisine: Cuisine = this.repository.create(createCuisineDto);
    return this.repository.save(cuisine);
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
      return this.repository.save({
        id,
        ...updateCuisineDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const cuisine: Cuisine = await this.findOneById(id);
      return this.repository.softRemove(cuisine);
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

      return this.repository.softRemove(cuisineArray);
    } catch (error) {
      throw error;
    }
  }
}
