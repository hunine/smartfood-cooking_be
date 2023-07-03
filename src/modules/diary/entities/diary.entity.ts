import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeOfMeal } from '../../../common/enums/type-of-meal.enum';
import { Recipe } from '@app/recipe/entities';
import { User } from '@app/user/entities';

@Entity('diaries')
export class Diary extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ name: 'date', type: 'varchar' })
  date: string;

  @Column({
    name: 'type_of_meal',
    type: 'enum',
    enum: TypeOfMeal,
    nullable: true,
  })
  public typeOfMeal: TypeOfMeal;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeRating)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => User, (user) => user.recipeRating)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
