import { CacheModule, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { categoryProvider } from './category.provider';
import { REDIS_CONFIG } from '@config/env';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';

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
  ],
  controllers: [CategoryController],
  providers: [CategoryService, ...categoryProvider],
  exports: [CategoryService],
})
export class CategoryModule {}
