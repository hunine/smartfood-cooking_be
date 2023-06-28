import { Recipe } from '@app/recipe/entities';
import { User } from '@app/user/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recipe_ratings')
export class RecipeRating extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'int' })
  public value: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeRating)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => User, (user) => user.recipeRating)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
