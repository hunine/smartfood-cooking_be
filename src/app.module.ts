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
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CookingHistoryModule } from './modules/cooking-history/cooking-history.module';

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
    CloudinaryModule,
    AuthModule,
    UserModule,
    CookingHistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
