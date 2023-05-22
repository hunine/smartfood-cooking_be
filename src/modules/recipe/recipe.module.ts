import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities';
import { LevelModule } from 'src/modules/level/level.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { CuisineModule } from 'src/modules/cuisine/cuisine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe]),
    LevelModule,
    CategoryModule,
    CuisineModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
