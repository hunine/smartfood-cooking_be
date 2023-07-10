import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@app/base/database/database.module';
import { diaryProvider } from '@app/diary/diary.provider';
import { DiaryService } from '@app/diary/diary.service';
import { DiaryController } from '@app/diary/diary.controller';
import { RecipeModule } from '@app/recipe/recipe.module';
import { MealModule } from '@app/meal/meal.module';
import { UserModule } from '@app/user/user.module';
import { ExerciseModule } from '@app/exercise/exercise.module';

@Module({
  imports: [
    DatabaseModule,
    MealModule,
    ExerciseModule,
    forwardRef(() => RecipeModule),
    forwardRef(() => UserModule),
  ],
  controllers: [DiaryController],
  providers: [DiaryService, ...diaryProvider],
  exports: [DiaryService],
})
export class DiaryModule {}
