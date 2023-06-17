import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '@app/base/database/database.module';
import { userProvider } from './user.provider';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, ...userProvider],
  exports: [UserService],
})
export class UserModule {}
