import { CacheModule, Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { levelProvider } from './level.provider';
import { REDIS_CONFIG } from '@config/env';
import { BullModule } from '@nestjs/bull';
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
  ],
  controllers: [LevelController],
  providers: [LevelService, ...levelProvider],
  exports: [LevelService],
})
export class LevelModule {}
