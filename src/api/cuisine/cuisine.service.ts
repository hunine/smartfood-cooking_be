import { Injectable } from '@nestjs/common';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';
import { Cuisine } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CuisineService {
  @InjectRepository(Cuisine) private readonly repository: Repository<Cuisine>;

  async create(createCuisineDto: CreateCuisineDto): Promise<Cuisine> {
    const cuisine: Cuisine = this.repository.create(createCuisineDto);
    return this.repository.save(cuisine);
  }

  async findAll(): Promise<Cuisine[]> {
    return this.repository.find();
  }

  async findOneById(id: string): Promise<Cuisine> {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateCuisineDto: UpdateCuisineDto) {
    return `This action updates a #${id} cuisine`;
  }

  remove(id: number) {
    return `This action removes a #${id} cuisine`;
  }
}
