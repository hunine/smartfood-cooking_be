import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { RecipeStep } from './entities';

export enum RecipeStepProvider {
  REPOSITORY = 'RECIPE_STEP_REPOSITORY',
}

export const recipeStepProvider = [
  {
    provide: RecipeStepProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RecipeStep),
    inject: [DatabaseProvider.SOURCE],
  },
];
