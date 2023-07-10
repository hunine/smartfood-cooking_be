import { DatabaseModule } from '@app/base/database/database.module';
import { Module } from '@nestjs/common';
import { exerciseProvider } from './exercise.provider';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ExerciseController],
  providers: [ExerciseService, ...exerciseProvider],
  exports: [ExerciseService],
})
export class ExerciseModule {}
