import { Module } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { CuisineController } from './cuisine.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { cuisineProvider } from './cuisine.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CuisineController],
  providers: [CuisineService, ...cuisineProvider],
  exports: [CuisineService],
})
export class CuisineModule {}
