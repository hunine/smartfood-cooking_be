import { Inject, Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';
import { In, Repository } from 'typeorm';
import { LevelProvider } from './level.provider';

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

  async findAll(): Promise<Level[]> {
    return this.repository.find();
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
