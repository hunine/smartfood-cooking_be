import { DatabaseModule } from '@app/base/database/database.module';
import { Module } from '@nestjs/common';
import { startNutritionProvider } from './start-nutrition.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...startNutritionProvider],
})
export class StartNutritionModule {}
