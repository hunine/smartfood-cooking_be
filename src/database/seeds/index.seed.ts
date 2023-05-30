import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Category } from '@app/category/entities';
import { Cuisine } from '@app/cuisine/entities';
import { Level } from '@app/level/entities';
import { Ingredient } from '@app/ingredient/entities';
import { Recipe } from '@app/recipe/entities';

import * as categoryJsonData from '../data/categories.json';
import * as cuisineJsonData from '../data/cuisine.json';
import * as levelJsonData from '../data/levels.json';
import * as ingredientJsonData from '../data/ingredients.json';
import * as recipeJsonData from '../data/recipes.json';
import * as quantificationJsonData from '../data/quantification.json';
import { Quantification } from '@app/quantification/entities';

export default class DataSeeder implements Seeder {
  public async run(factory: Factory, datasource: DataSource): Promise<any> {
    // Category
    await datasource
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(Array.from(categoryJsonData['default']))
      .execute();

    const categoryMapping = {};
    (await datasource.getRepository(Category).find()).forEach((item) => {
      categoryMapping[item.name] = item;
    });

    // Cuisine
    await datasource
      .createQueryBuilder()
      .insert()
      .into(Cuisine)
      .values(Array.from(cuisineJsonData['default']))
      .execute();

    const cuisineMapping = {};
    (await datasource.getRepository(Cuisine).find()).forEach((item) => {
      cuisineMapping[item.name] = item;
    });

    // Level
    await datasource
      .createQueryBuilder()
      .insert()
      .into(Level)
      .values(Array.from(levelJsonData['default']))
      .execute();

    const levelMapping = {};
    (await datasource.getRepository(Level).find()).forEach((item) => {
      levelMapping[item.name] = item;
    });

    // Ingredient
    await datasource
      .createQueryBuilder()
      .insert()
      .into(Ingredient)
      .values(Array.from(ingredientJsonData['default']))
      .execute();

    const ingredientMapping = {};
    (await datasource.getRepository(Ingredient).find()).forEach((item) => {
      ingredientMapping[item.name] = item;
    });

    // Recipe
    const recipes: Recipe[] = [];
    Array.from(recipeJsonData['default']).forEach((item: any) => {
      const recipe = new Recipe();

      recipe.name = item.name;
      recipe.description = item.description;
      recipe.category = categoryMapping[item.category];
      recipe.cuisine = cuisineMapping[item.cuisine];
      recipe.level = levelMapping[item.level];

      recipes.push(recipe);
    });

    await datasource.getRepository(Recipe).save(recipes);

    const recipeMapping = {};
    (await datasource.getRepository(Recipe).find()).forEach((item) => {
      recipeMapping[item.name] = item;
    });

    // Quantification
    const quantificationArray: Quantification[] = [];
    const quantificationDataArray: any[] = Array.from(
      quantificationJsonData['default'],
    );

    for (let i = 0; i < quantificationDataArray.length; i += 1) {
      const quantification = new Quantification();

      if (
        !recipeMapping[quantificationDataArray[i].recipe_name] ||
        !ingredientMapping[quantificationDataArray[i].ingredient_name] ||
        !quantificationDataArray[i].value ||
        !quantificationDataArray[i].unit
      ) {
        continue;
      }

      quantification.recipe =
        recipeMapping[quantificationDataArray[i].recipe_name];
      quantification.ingredient =
        ingredientMapping[quantificationDataArray[i].ingredient_name];
      quantification.value = quantificationDataArray[i].value;
      quantification.unit = quantificationDataArray[i].unit;

      quantificationArray.push(quantification);

      if (quantificationArray.length === 1000) {
        await datasource
          .getRepository(Quantification)
          .save(quantificationArray);
        quantificationArray.length = 0;
      }
    }

    if (quantificationArray.length > 0) {
      await datasource.getRepository(Quantification).save(quantificationArray);
    }
  }
}
