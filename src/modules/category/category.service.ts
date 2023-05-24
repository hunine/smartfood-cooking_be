import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities';
import { CategoryProvider } from './category.provider';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CategoryProvider.REPOSITORY)
    private readonly repository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category: Category = this.repository.create(createCategoryDto);
    return this.repository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.repository.find();
  }

  async findOneById(id: string): Promise<Category> {
    return this.repository.findOneByOrFail({ id });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
