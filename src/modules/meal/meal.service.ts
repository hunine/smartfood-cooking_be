import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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
}
