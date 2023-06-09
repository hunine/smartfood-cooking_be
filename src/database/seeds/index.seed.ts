import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Category } from '@app/category/entities';
import { Cuisine } from '@app/cuisine/entities';
import { Level } from '@app/level/entities';
import { Ingredient } from '@app/ingredient/entities';
import { Recipe } from '@app/recipe/entities';
import { Quantification } from '@app/quantification/entities';
import { RecipeStep } from '@app/recipe-step/entities';

import * as categoryJsonData from '../data/categories.json';
import * as cuisineJsonData from '../data/cuisine.json';
import * as levelJsonData from '../data/levels.json';
import * as ingredientJsonData from '../data/ingredients.json';
import * as recipeJsonData from '../data/recipes.json';
import * as quantificationJsonData from '../data/quantification.json';
import * as recipeStepJsonData from '../data/recipe_steps.json';

export default class DataSeeder implements Seeder {
  private async seedCategories(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(Array.from(categoryJsonData['default']))
      .execute();

    const categoryMapping = {};

    (await dataSource.getRepository(Category).find()).forEach((item) => {
      categoryMapping[item.name] = item;
    });

    return categoryMapping;
  }

  private async seedCuisine(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Cuisine)
      .values(Array.from(cuisineJsonData['default']))
      .execute();

    const cuisineMapping = {};

    (await dataSource.getRepository(Cuisine).find()).forEach((item) => {
      cuisineMapping[item.name] = item;
    });

    return cuisineMapping;
  }

  private async seedLevels(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Level)
      .values(Array.from(levelJsonData['default']))
      .execute();

    const levelMapping = {};

    (await dataSource.getRepository(Level).find()).forEach((item) => {
      levelMapping[item.name] = item;
    });

    return levelMapping;
  }

  private async seedIngredients(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Ingredient)
      .values(Array.from(ingredientJsonData['default']))
      .execute();

    const ingredientMapping = {};

    (await dataSource.getRepository(Ingredient).find()).forEach((item) => {
      ingredientMapping[item.name] = item;
    });

    return ingredientMapping;
  }

  private async seedRecipes(mapping, dataSource: DataSource): Promise<any> {
    const { categoryMapping, cuisineMapping, levelMapping } = mapping;
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

    await dataSource.getRepository(Recipe).save(recipes);

    const recipeMapping = {};

    (await dataSource.getRepository(Recipe).find()).forEach((item) => {
      recipeMapping[item.name] = item;
    });

    return recipeMapping;
  }

  private async seedQuantification(
    mapping,
    dataSource: DataSource,
  ): Promise<any> {
    const { recipeMapping, ingredientMapping } = mapping;
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
        await dataSource
          .getRepository(Quantification)
          .save(quantificationArray);
        quantificationArray.length = 0;
      }
    }

    if (quantificationArray.length > 0) {
      await dataSource.getRepository(Quantification).save(quantificationArray);
    }
  }

  private async seedRecipeSteps(mapping, dataSource: DataSource) {
    const { recipeMapping } = mapping;
    const recipeSteps: RecipeStep[] = [];
    const recipeStepsData: any[] = Array.from(recipeStepJsonData['default']);

    for (let i = 0; i < recipeStepsData.length; i += 1) {
      const recipeStep = new RecipeStep();

      if (!recipeMapping[recipeStepsData[i].recipe_name]) {
        continue;
      }

      recipeStep.content = recipeStepsData[i].content;
      recipeStep.order = recipeStepsData[i].order;
      recipeStep.recipe = recipeMapping[recipeStepsData[i].recipe_name];

      recipeSteps.push(recipeStep);

      if (recipeSteps.length === 1000) {
        await dataSource.getRepository(RecipeStep).save(recipeSteps);
        recipeSteps.length = 0;
      }
    }

    if (recipeSteps.length > 0) {
      await dataSource.getRepository(RecipeStep).save(recipeSteps);
    }
  }

  public async run(factory: Factory, datasource: DataSource): Promise<any> {
    // Category
    const categoryMapping = await this.seedCategories(datasource);

    // Cuisine
    const cuisineMapping = await this.seedCuisine(datasource);

    // Level
    const levelMapping = await this.seedLevels(datasource);

    // Ingredient
    const ingredientMapping = await this.seedIngredients(datasource);

    // Recipe
    const recipeMapping = await this.seedRecipes(
      { categoryMapping, cuisineMapping, levelMapping },
      datasource,
    );

    // Quantification
    await this.seedQuantification(
      { recipeMapping, ingredientMapping },
      datasource,
    );

    // RecipeStep
    await this.seedRecipeSteps({ recipeMapping }, datasource);
  }
}
