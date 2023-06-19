import { Ingredient } from 'src/modules/ingredient/entities';
import { RecipeStep } from 'src/modules/recipe-step/entities';
import { Recipe } from 'src/modules/recipe/entities';
import { User } from '@app/user/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public url: string;

  @Column({ type: 'int', nullable: true })
  public width?: number;

  @Column({ type: 'int', nullable: true })
  public height?: number;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.media)
  ingredient: Ingredient[];

  @ManyToMany(() => Recipe, (recipe) => recipe.media)
  recipe: Recipe[];

  @ManyToMany(() => RecipeStep, (recipeStep) => recipeStep.media)
  recipeStep: RecipeStep[];

  @OneToOne(() => User, (user) => user.avatar)
  user: User;
}
