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

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    RecipeModule,
    LevelModule,
    CuisineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
