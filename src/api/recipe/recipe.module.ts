import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities';
import { LevelModule } from '@api/level/level.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), LevelModule],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
