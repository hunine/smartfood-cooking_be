import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '@app/base/database/database.module';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';
import { StartNutritionModule } from '@app/start-nutrition/start-nutrition.module';

@Module({
  imports: [DatabaseModule, StartNutritionModule],
  controllers: [UserController],
  providers: [UserService, ...userProvider],
  exports: [UserService],
})
export class UserModule {}
