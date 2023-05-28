import { Inject, Injectable } from '@nestjs/common';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';
import { Cuisine } from './entities';
import { In, Repository } from 'typeorm';
import { CuisineProvider } from './cuisine.provider';

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

  async findAll(): Promise<Cuisine[]> {
    return this.repository.find();
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
