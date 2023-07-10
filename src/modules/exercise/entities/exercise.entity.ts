import { BaseEntity } from '@base/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExercisesDiaries } from './exercises-diaries.entity';

@Entity('exercises')
export class Exercise extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'int' })
  public minute: number;

  @Column({ type: 'int' })
  public calo: number;

  @OneToMany(
    () => ExercisesDiaries,
    (exerciseDiaries) => exerciseDiaries.exercise,
  )
  exercisesDiaries: ExercisesDiaries[];
}
