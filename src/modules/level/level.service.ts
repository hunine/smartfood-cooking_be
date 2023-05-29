import { Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class LevelService {
  constructor(
    @Inject(LevelProvider.REPOSITORY)
    private readonly repository: Repository<Level>,
  ) {}

  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const level: Level = this.repository.create(createLevelDto);
    return this.repository.save(level);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Level>> {
    return paginate(query, this.repository, {
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['name'],
      select: ['id', 'name'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
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
      return this.repository.save({
        id,
        ...updateLevelDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const level: Level = await this.findOneById(id);
      return this.repository.softRemove(level);
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      const levels: Level[] = await this.repository.find({
        where: {
          id: In(ids),
        },
      });

      return this.repository.softRemove(levels);
    } catch (error) {
      throw error;
    }
  }
}
