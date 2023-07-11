import { CacheModule, Module, forwardRef } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { LevelModule } from 'src/modules/level/level.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { CuisineModule } from 'src/modules/cuisine/cuisine.module';
import { DatabaseModule } from '@app/base/database/database.module';
import { recipeProvider } from './recipe.provider';
import { IngredientModule } from '@app/ingredient/ingredient.module';
import { CookingHistoryModule } from '@app/cooking-history/cooking-history.module';
import { BullModule } from '@nestjs/bull';
import { REDIS_CONFIG } from '@config/env';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: REDIS_CONFIG.HOST,
      port: REDIS_CONFIG.PORT,
      username: REDIS_CONFIG.USERNAME,
      password: REDIS_CONFIG.PASSWORD,
      ttl: REDIS_CONFIG.TTL,
    }),
    BullModule.forRoot({
      redis: {
        host: REDIS_CONFIG.HOST,
        port: REDIS_CONFIG.PORT,
        username: REDIS_CONFIG.USERNAME,
        password: REDIS_CONFIG.PASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    DatabaseModule,
    forwardRef(() => LevelModule),
    CategoryModule,
    CuisineModule,
    IngredientModule,
    CookingHistoryModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService, ...recipeProvider],
  exports: [RecipeService],
})
export class RecipeModule {}
