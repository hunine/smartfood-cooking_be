import { Ingredient } from '@api/ingredient/entities';
import { Recipe } from '@api/recipe/entities';
import { BaseEntity } from '@base/base.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Quantification extends BaseEntity {
  @PrimaryColumn('uuid')
  recipeId: string;

  @PrimaryColumn('uuid')
  ingredientId: string;

  @Column({ type: 'decimal' })
  public value: number;

  @Column({ type: 'varchar' })
  public unit: string;

  @OneToOne(() => Recipe, (recipe) => recipe.quantification)
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @OneToOne(() => Ingredient, (ingredient) => ingredient.quantification)
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;
}
