import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { User } from './entities';

export enum UserProvider {
  REPOSITORY = 'USER_REPOSITORY',
}

export const userProvider = [
  {
    provide: UserProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DatabaseProvider.SOURCE],
  },
];
