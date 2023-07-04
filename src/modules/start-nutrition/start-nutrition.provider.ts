import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { StartNutrition } from './entities';

export enum StartNutritionProvider {
  REPOSITORY = 'START_NUTRITION_REPOSITORY',
}

export const startNutritionProvider = [
  {
    provide: StartNutritionProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(StartNutrition),
    inject: [DatabaseProvider.SOURCE],
  },
];
