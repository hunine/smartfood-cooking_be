import { DatabaseModule } from '@app/base/database/database.module';
import { Module } from '@nestjs/common';
import { mealProvider } from './meal.provider';
import { MealService } from './meal.service';

@Module({
  imports: [DatabaseModule],
  providers: [MealService, ...mealProvider],
  exports: [MealService],
})
export class MealModule {}
