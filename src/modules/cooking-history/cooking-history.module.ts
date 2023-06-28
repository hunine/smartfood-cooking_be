import { Module } from '@nestjs/common';
import { CookingHistoryService } from './cooking-history.service';
import { DatabaseModule } from '@app/base/database/database.module';
import { cookingHistoryProvider } from './cooking-history.provider';
import { UserModule } from '@app/user/user.module';
import { CookingHistoryController } from './cooking-history.controller';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [CookingHistoryController],
  providers: [CookingHistoryService, ...cookingHistoryProvider],
  exports: [CookingHistoryService],
})
export class CookingHistoryModule {}
