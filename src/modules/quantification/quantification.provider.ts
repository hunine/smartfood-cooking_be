import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Quantification } from './entities';

export enum QuantificationProvider {
  REPOSITORY = 'QUANTIFICATION_REPOSITORY',
}

export const quantificationProvider = [
  {
    provide: QuantificationProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Quantification),
    inject: [DatabaseProvider.SOURCE],
  },
];
