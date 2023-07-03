import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/base/database/database.module';
import { diaryProvider } from '@app/diary/diary.provider';
import { DiaryService } from '@app/diary/diary.service';
import { DiaryController } from '@app/diary/diary.controller';
import { RecipeModule } from '@app/recipe/recipe.module';

@Module({
  imports: [DatabaseModule, RecipeModule],
  controllers: [DiaryController],
  providers: [DiaryService, ...diaryProvider],
})
export class DiaryModule {}
