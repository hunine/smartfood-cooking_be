import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { CookingHistory } from './entities/cooking-history.entity';

export enum CookingHistoryProvider {
  REPOSITORY = 'COOKING_HISTORY_REPOSITORY',
}

export const cookingHistoryProvider = [
  {
    provide: CookingHistoryProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CookingHistory),
    inject: [DatabaseProvider.SOURCE],
  },
];
