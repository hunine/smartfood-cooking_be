import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { RecipeRating } from './entities';

export enum RecipeRatingProvider {
  REPOSITORY = 'RECIPE_RATING_REPOSITORY',
}

export const recipeRatingProvider = [
  {
    provide: RecipeRatingProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RecipeRating),
    inject: [DatabaseProvider.SOURCE],
  },
];
