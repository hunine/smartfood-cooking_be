import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { LevelModule } from 'src/modules/level/level.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { CuisineModule } from 'src/modules/cuisine/cuisine.module';
import { DatabaseModule } from '@app/base/database/database.module';
import { recipeProvider } from './recipe.provider';
import { IngredientModule } from '@app/ingredient/ingredient.module';
import { CookingHistoryModule } from '@app/cooking-history/cooking-history.module';

@Module({
  imports: [
    DatabaseModule,
    LevelModule,
    CategoryModule,
    CuisineModule,
    IngredientModule,
    CookingHistoryModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService, ...recipeProvider],
  exports: [RecipeService],
})
export class RecipeModule {}
