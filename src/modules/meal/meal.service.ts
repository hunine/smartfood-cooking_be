import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { MealProvider } from './meal.provider';
import { Meal } from './entities';

@Injectable()
export class MealService {
  constructor(
    @Inject(MealProvider.REPOSITORY)
    private readonly repository: Repository<Meal>,
  ) {}

  async create(meal: Meal): Promise<Meal> {
    return this.repository.save(meal);
  }

  async createMany(meals: Meal[]): Promise<Meal[]> {
    return this.repository.save(meals);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findManyByIds(ids) {
    try {
      return this.repository.find({
        where: {
          id: In(ids),
        },
        relations: ['recipe', 'recipe.media', 'diary'],
        select: ['id', 'typeOfMeal', 'recipe'],
      });
    } catch (error) {
      throw error;
    }
  }
}
