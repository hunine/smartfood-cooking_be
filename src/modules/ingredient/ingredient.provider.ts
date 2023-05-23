import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Ingredient } from './entities';

export enum IngredientProvider {
  REPOSITORY = 'INGREDIENT_REPOSITORY',
}

export const ingredientProvider = [
  {
    provide: IngredientProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Ingredient),
    inject: [DatabaseProvider.SOURCE],
  },
];
