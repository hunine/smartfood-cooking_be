import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Cuisine } from './entities';

export enum CuisineProvider {
  REPOSITORY = 'CUISINE_REPOSITORY',
}

export const cuisineProvider = [
  {
    provide: CuisineProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Cuisine),
    inject: [DatabaseProvider.SOURCE],
  },
];
