import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Meal } from './entities';

export enum MealProvider {
  REPOSITORY = 'MEAL_REPOSITORY',
}

export const mealProvider = [
  {
    provide: MealProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Meal),
    inject: [DatabaseProvider.SOURCE],
  },
];
