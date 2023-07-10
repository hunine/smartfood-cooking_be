import { Inject, Injectable } from '@nestjs/common';
import { ExerciseProvider } from './exercise.provider';
import { Exercise } from './entities/exercise.entity';
import { In, Repository } from 'typeorm';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject(ExerciseProvider.REPOSITORY)
    private readonly repository: Repository<Exercise>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<Exercise>> {
    return paginate(query, this.repository, {
      sortableColumns: ['id', 'name', 'minute', 'calo'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      select: ['id', 'name', 'minute', 'calo'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
        minute: [
          FilterOperator.EQ,
          FilterOperator.GT,
          FilterOperator.GTE,
          FilterOperator.LT,
          FilterOperator.LTE,
          FilterOperator.BTW,
        ],
        calo: [
          FilterOperator.EQ,
          FilterOperator.GT,
          FilterOperator.GTE,
          FilterOperator.LT,
          FilterOperator.LTE,
          FilterOperator.BTW,
        ],
      },
    });
  }

  async findManyByIds(ids: string[]): Promise<Exercise[]> {
    return this.repository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findOneById(id: string): Promise<Exercise> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }
}
