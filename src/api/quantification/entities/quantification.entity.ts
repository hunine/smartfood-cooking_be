import { Ingredient } from '@api/ingredient/entities';
import { Recipe } from '@api/recipe/entities';
import { BaseEntity } from '@base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Quantification extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', name: 'recipe_id' })
  recipeId: string;

  @PrimaryColumn({ type: 'uuid', name: 'ingredient_id' })
  ingredientId: string;

  @Column({ type: 'decimal' })
  public value: number;

  @Column({ type: 'varchar' })
  public unit: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.quantification)
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.quantification)
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;
}
