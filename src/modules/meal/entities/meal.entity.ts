import { Diary } from '@app/diary/entities';
import { Recipe } from '@app/recipe/entities';
import { TypeOfMeal } from 'src/common/enums/type-of-meal.enum';
import {
  BaseEntity,
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

  @ManyToOne(() => Diary, (diary) => diary.meals)
  @JoinColumn({ name: 'diary_id' })
  diary: Diary;

  @ManyToOne(() => Recipe, (recipe) => recipe.meals)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
