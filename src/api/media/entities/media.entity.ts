import { Ingredient } from '@api/ingredient/entities';
import { RecipeStep } from '@api/recipe-step/entities';
import { Recipe } from '@api/recipe/entities';
import { BaseEntity } from '@base/base.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public url: string;

  @Column({ type: 'int' })
  public width: number;

  @Column({ type: 'int' })
  public height: number;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.media)
  ingredient: Ingredient;

  @ManyToMany(() => Recipe, (recipe) => recipe.media)
  recipe: Recipe;

  @ManyToMany(() => RecipeStep, (recipeStep) => recipeStep.media)
  recipeStep: RecipeStep;
}
