import { Media } from 'src/modules/media/entities';
import { Recipe } from 'src/modules/recipe/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
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
  @JoinTable({
    name: 'steps_media',
    joinColumn: {
      name: 'step_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'media_id',
      referencedColumnName: 'id',
    },
  })
  media: Media[];
}

@Entity('steps_media')
export class RecipeStepMedia {
  @PrimaryColumn({ name: 'step_id' })
  stepId: number;

  @PrimaryColumn({ name: 'media_id' })
  mediaId: number;

  @ManyToOne(() => RecipeStep, (step) => step.media)
  @JoinColumn([{ name: 'step_id', referencedColumnName: 'id' }])
  steps: RecipeStep[];

  @ManyToOne(() => Media, (media) => media.ingredient)
  @JoinColumn([{ name: 'media_id', referencedColumnName: 'id' }])
  media: Media[];
}
