import { Ingredient } from 'src/modules/ingredient/entities';
import { Recipe } from 'src/modules/recipe/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Quantification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

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
