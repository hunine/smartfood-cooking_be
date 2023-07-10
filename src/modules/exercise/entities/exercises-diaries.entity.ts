import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exercise } from './exercise.entity';
import { Diary } from '@app/diary/entities';

@Entity('exercises_diaries')
export class ExercisesDiaries extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => Exercise, (exercise) => exercise.exercisesDiaries)
  exercise: Exercise;

  @ManyToOne(() => Diary, (diary) => diary.exercisesDiaries)
  diary: Diary;
}
