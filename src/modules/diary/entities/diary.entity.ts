import { ExercisesDiaries } from '@app/exercise/entities/exercises-diaries.entity';
import { Meal } from '@app/meal/entities';
import { User } from '@app/user/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('diaries')
export class Diary extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ name: 'date', type: 'varchar' })
  public date: string;

  @Column({ name: 'total_calories', type: 'float', default: 0 })
  public totalCalories: number;

  @Column({ name: 'fat', type: 'float', default: 0 })
  public fat: number;

  @Column({ name: 'carbs', type: 'float', default: 0 })
  public carbs: number;

  @Column({ name: 'protein', type: 'float', default: 0 })
  public protein: number;

  @ManyToOne(() => User, (user) => user.diaries)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Meal, (meal) => meal.diary)
  meals: Meal[];

  @OneToMany(() => ExercisesDiaries, (exerciseDiaries) => exerciseDiaries.diary)
  exercisesDiaries: ExercisesDiaries[];
}
