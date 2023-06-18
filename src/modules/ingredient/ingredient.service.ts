import { Inject, Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities';
import { In, Repository } from 'typeorm';
import { IngredientProvider } from './ingredient.provider';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import translateHelper from 'src/helpers';

@Injectable()
export class IngredientService {
  constructor(
    @Inject(IngredientProvider.REPOSITORY)
    private readonly repository: Repository<Ingredient>,
  ) {}

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
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      select: ['id', 'name', 'media.id', 'media.url'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
      },
    });
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
      return this.repository.save({
        id,
        ...updateIngredientDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const ingredient: Ingredient = await this.findOneById(id);
      return this.repository.softRemove(ingredient);
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      const ingredients: Ingredient[] = await this.repository.find({
        where: {
          id: In(ids),
        },
      });

      return this.repository.softRemove(ingredients);
    } catch (error) {
      throw error;
    }
  }
}
