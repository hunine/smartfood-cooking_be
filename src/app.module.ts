import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';

import { RecipeModule } from './api/recipe/recipe.module';
import { LevelModule } from './api/level/level.module';
import { CuisineModule } from './api/cuisine/cuisine.module';
import { CategoryModule } from './api/category/category.module';
import { IngredientModule } from './api/ingredient/ingredient.module';
import { QuantificationModule } from './api/quantification/quantification.module';
import { RecipeStepModule } from './api/recipe-step/recipe-step.module';
import { MediaModule } from './api/media/media.module';

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
