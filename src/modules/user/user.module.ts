import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '@app/base/database/database.module';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';
import { DiaryModule } from '@app/diary/diary.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => DiaryModule)],
  controllers: [UserController],
  providers: [UserService, ...userProvider],
  exports: [UserService],
})
export class UserModule {}
