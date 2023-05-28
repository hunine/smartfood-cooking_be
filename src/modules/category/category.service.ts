import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { In, Repository } from 'typeorm';
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

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      return this.repository.save({
        id,
        ...updateCategoryDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const category: Category = await this.findOneById(id);
      return this.repository.softRemove(category);
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

      return this.repository.softRemove(categories);
    } catch (error) {
      throw error;
    }
  }
}
