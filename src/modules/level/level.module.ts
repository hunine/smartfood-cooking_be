import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { levelProvider } from './level.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [LevelController],
  providers: [LevelService, ...levelProvider],
  exports: [LevelService],
})
export class LevelModule {}
