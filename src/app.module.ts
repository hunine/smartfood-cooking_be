import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/base/database/database.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { LevelModule } from './modules/level/level.module';
import { CuisineModule } from './modules/cuisine/cuisine.module';
import { CategoryModule } from './modules/category/category.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { QuantificationModule } from './modules/quantification/quantification.module';
import { RecipeStepModule } from './modules/recipe-step/recipe-step.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    DatabaseModule,
    QuantificationModule,
    LevelModule,
    CuisineModule,
    CategoryModule,
    IngredientModule,
    RecipeModule,
    RecipeStepModule,
    MediaModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
