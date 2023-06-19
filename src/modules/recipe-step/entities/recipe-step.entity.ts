import { Media } from 'src/modules/media/entities';
import { Recipe } from 'src/modules/recipe/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recipe_steps')
export class RecipeStep extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'text' })
  public content: string;

  @Column({ type: 'int' })
  public order: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeStep)
  recipe: Recipe;

  @ManyToMany(() => Media, (media) => media.recipeStep)
  @JoinTable({ name: 'steps_media' })
  media: Media[];
}
