import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';

import { RecipeModule } from './modules/recipe/recipe.module';
import { LevelModule } from './modules/level/level.module';
import { CuisineModule } from './modules/cuisine/cuisine.module';
import { CategoryModule } from './modules/category/category.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { QuantificationModule } from './modules/quantification/quantification.module';
import { RecipeStepModule } from './modules/recipe-step/recipe-step.module';
import { MediaModule } from './modules/media/media.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    QuantificationModule,
    LevelModule,
    CuisineModule,
    CategoryModule,
    IngredientModule,
    RecipeModule,
    RecipeStepModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
