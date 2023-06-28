import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/base/database/database.module';
import { recipeRatingProvider } from './recipe-rating.provider';
import { RecipeRatingController } from './recipe-rating.controller';
import { RecipeRatingService } from './recipe-rating.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RecipeRatingController],
  providers: [RecipeRatingService, ...recipeRatingProvider],
  exports: [RecipeRatingService],
})
export class RecipeRatingModule {}
