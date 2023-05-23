import { Module } from '@nestjs/common';
import { RecipeStepService } from './recipe-step.service';
import { RecipeStepController } from './recipe-step.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { recipeStepProvider } from './recipe-step.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [RecipeStepController],
  providers: [RecipeStepService, ...recipeStepProvider],
})
export class RecipeStepModule {}
