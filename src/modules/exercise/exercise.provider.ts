import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Exercise } from './entities/exercise.entity';

export enum ExerciseProvider {
  REPOSITORY = 'EXERCISE_REPOSITORY',
}

export const exerciseProvider = [
  {
    provide: ExerciseProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Exercise),
    inject: [DatabaseProvider.SOURCE],
  },
];
