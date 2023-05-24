import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Recipe } from './entities';

export enum RecipeProvider {
  REPOSITORY = 'RECIPE_REPOSITORY',
}

export const recipeProvider = [
  {
    provide: RecipeProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Recipe),
    inject: [DatabaseProvider.SOURCE],
  },
];
