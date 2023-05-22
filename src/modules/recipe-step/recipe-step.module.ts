import { Module } from '@nestjs/common';
import { RecipeStepService } from './recipe-step.service';
import { RecipeStepController } from './recipe-step.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeStep } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeStep])],
  controllers: [RecipeStepController],
  providers: [RecipeStepService],
})
export class RecipeStepModule {}
