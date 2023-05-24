import { Ingredient } from 'src/modules/ingredient/entities';
import { Recipe } from 'src/modules/recipe/entities';
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
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.quantification)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
}
