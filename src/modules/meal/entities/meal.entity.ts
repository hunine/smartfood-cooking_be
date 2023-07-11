import { Diary } from '@app/diary/entities';
import { Recipe } from '@app/recipe/entities';
import { BaseEntity } from '@base/base.entity';
import { TypeOfMeal } from 'src/common/enums/type-of-meal.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('meals')
export class Meal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    name: 'type_of_meal',
    type: 'enum',
    nullable: true,
    enum: TypeOfMeal,
  })
  public typeOfMeal: TypeOfMeal;

  @Column({ type: 'float', default: 0 })
  public kcal: number;

  @Column({ type: 'float', default: 0 })
  public carbs: number;

  @Column({ type: 'float', default: 0 })
  public protein: number;

  @Column({ type: 'float', default: 0 })
  public fat: number;

  @Column({ type: 'int', default: 1 })
  public totalPeople: number;

  @ManyToOne(() => Diary, (diary) => diary.meals)
  @JoinColumn({ name: 'diary_id' })
  diary: Diary;

  @ManyToOne(() => Recipe, (recipe) => recipe.meals)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
