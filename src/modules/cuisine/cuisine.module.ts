import { CacheModule, Module, forwardRef } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { CuisineController } from './cuisine.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { cuisineProvider } from './cuisine.provider';
import { REDIS_CONFIG } from '@config/env';
import { BullModule } from '@nestjs/bull';
import * as redisStore from 'cache-manager-redis-store';
import { RecipeModule } from '@app/recipe/recipe.module';

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
    forwardRef(() => RecipeModule),
  ],
  controllers: [CuisineController],
  providers: [CuisineService, ...cuisineProvider],
  exports: [CuisineService],
})
export class CuisineModule {}
