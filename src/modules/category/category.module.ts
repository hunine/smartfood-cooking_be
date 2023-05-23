import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { categoryProvider } from './category.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, ...categoryProvider],
  exports: [CategoryService],
})
export class CategoryModule {}
