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
import * as averageWeightJsonData from '../data/average_weight.json';
import { Media } from '@app/media/entities';
import { AverageWeight } from '@app/ingredient/entities/average_weight.entity';

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
    const ingredients: Ingredient[] = [];
    const ingredientsData: any[] = Array.from(ingredientJsonData['default']);

    for (let i = 0; i < ingredientsData.length; i += 1) {
      const ingredient = new Ingredient();
      const media = new Media();

      media.url = ingredientsData[i].media;
      ingredient.name = ingredientsData[i].name;
      ingredient.slug = ingredientsData[i].slug;
      ingredient.kcal = ingredientsData[i].kcal;
      ingredient.carbs = ingredientsData[i].carbs;
      ingredient.protein = ingredientsData[i].protein;
      ingredient.fat = ingredientsData[i].fat;
      ingredient.media = [media];

      await dataSource.getRepository(Media).save(media);
      ingredients.push(ingredient);
    }

    await dataSource.getRepository(Ingredient).save(ingredients);

    const ingredientMapping = {};

    (await dataSource.getRepository(Ingredient).find()).forEach((item) => {
      ingredientMapping[item.name] = item;
    });

    return ingredientMapping;
  }

  private async seedRecipes(mapping, dataSource: DataSource): Promise<any> {
    const { categoryMapping, cuisineMapping, levelMapping } = mapping;
    const recipes: Recipe[] = [];
    const recipesData: any[] = Array.from(recipeJsonData['default']);

    for (let i = 0; i < recipesData.length; i += 1) {
      const recipe = new Recipe();
      const media = new Media();

      media.url = recipesData[i].media;
      recipe.name = recipesData[i].name;
      recipe.description = recipesData[i].description;
      recipe.category = categoryMapping[recipesData[i].category];
      recipe.cuisine = cuisineMapping[recipesData[i].cuisine];
      recipe.level = levelMapping[recipesData[i].level];
      recipe.media = [media];

      await dataSource.getRepository(Media).save(media);
      recipes.push(recipe);
    }

    await dataSource.getRepository(Recipe).save(recipes);

    const recipeMapping = {};

    (await dataSource.getRepository(Recipe).find()).forEach((item) => {
      recipeMapping[item.name] = item;
    });

    return recipeMapping;
  }

  private async seedAverageWeight(
    mapping,
    dataSource: DataSource,
  ): Promise<any> {
    const { ingredientMapping } = mapping;
    const averageWeightArray: AverageWeight[] = [];
    const averageWeightDataArray: any[] = Array.from(
      averageWeightJsonData['default'],
    );

    for (let i = 0; i < averageWeightDataArray.length; i += 1) {
      const averageWeight = new AverageWeight();

      averageWeight.ingredient =
        ingredientMapping[averageWeightDataArray[i].ingredient_name];
      averageWeight.unit = averageWeightDataArray[i].unit;
      averageWeight.gram = averageWeightDataArray[i].gram;

      averageWeightArray.push(averageWeight);

      if (averageWeightArray.length === 1000) {
        await dataSource.getRepository(AverageWeight).save(averageWeightArray);
        averageWeightArray.length = 0;
      }
    }

    if (averageWeightArray.length > 0) {
      await dataSource.getRepository(AverageWeight).save(averageWeightArray);
    }
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
      recipeStep.media = [];

      if (recipeStepsData[i] && !recipeStepsData[i].media) {
        recipeStepsData[i].media = [];
      }

      for (let j = 0; j < recipeStepsData[i].media.length; j += 1) {
        const media = new Media();

        media.url = recipeStepsData[i].media[j];

        await dataSource.getRepository(Media).save(media);
        recipeStep.media.push(media);
      }

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

    await this.seedAverageWeight({ ingredientMapping }, datasource);

    // RecipeStep
    await this.seedRecipeSteps({ recipeMapping }, datasource);
  }
}
