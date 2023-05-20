import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities';
import { LevelsModule } from '@api/levels/levels.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), LevelsModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
