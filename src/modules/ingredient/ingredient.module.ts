import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { ingredientProvider } from './ingredient.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [IngredientController],
  providers: [IngredientService, ...ingredientProvider],
})
export class IngredientModule {}
