import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Media } from './entities';

export enum MediaProvider {
  REPOSITORY = 'MEDIA_REPOSITORY',
}

export const mediaProvider = [
  {
    provide: MediaProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Media),
    inject: [DatabaseProvider.SOURCE],
  },
];
