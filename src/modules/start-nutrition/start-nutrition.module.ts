import { DatabaseModule } from '@app/base/database/database.module';
import { Module } from '@nestjs/common';
import { startNutritionProvider } from './start-nutrition.provider';
import { StartNutritionService } from './start-nutrition.services';

@Module({
  imports: [DatabaseModule],
  providers: [StartNutritionService, ...startNutritionProvider],
  exports: [StartNutritionService],
})
export class StartNutritionModule {}
