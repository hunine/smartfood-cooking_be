import { Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LevelService {
  @InjectRepository(Level)
  private readonly repository: Repository<Level>;

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

  update(id: number, updateLevelDto: UpdateLevelDto) {
    return `This action updates a #${id} level`;
  }

  remove(id: number) {
    return `This action removes a #${id} level`;
  }
}
