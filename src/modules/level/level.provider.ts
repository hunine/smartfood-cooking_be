import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Level } from './entities';

export enum LevelProvider {
  REPOSITORY = 'LEVEL_REPOSITORY',
}

export const levelProvider = [
  {
    provide: LevelProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Level),
    inject: [DatabaseProvider.SOURCE],
  },
];
