import { Category } from 'src/modules/category/entities';
import { Cuisine } from 'src/modules/cuisine/entities';
import { Level } from 'src/modules/level/entities';
import { Media } from 'src/modules/media/entities';
import { Quantification } from 'src/modules/quantification/entities';
import { RecipeStep } from 'src/modules/recipe-step/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recipes')
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @ManyToOne(() => Level, (level) => level.recipes)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @ManyToOne(() => Category, (category) => category.recipes)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Cuisine, (cuisine) => cuisine.recipes)
  @JoinColumn({ name: 'cuisine_id' })
  cuisine: Cuisine;

  @OneToMany(() => Quantification, (quantification) => quantification.recipe)
  quantification: Quantification[];

  @OneToMany(() => RecipeStep, (recipeStep) => recipeStep.recipe)
  recipeStep: RecipeStep[];

  @ManyToMany(() => Media, (media) => media.recipe)
  @JoinTable({
    name: 'recipes_media',
    joinColumn: {
      name: 'recipe_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'media_id',
      referencedColumnName: 'id',
    },
  })
  media: Media[];
}

@Entity('recipes_media')
export class RecipeMedia {
  @PrimaryColumn({ name: 'recipe_id' })
  recipeId: number;

  @PrimaryColumn({ name: 'media_id' })
  mediaId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.media)
  @JoinColumn([{ name: 'recipe_id', referencedColumnName: 'id' }])
  recipes: Recipe[];

  @ManyToOne(() => Media, (media) => media.ingredient)
  @JoinColumn([{ name: 'media_id', referencedColumnName: 'id' }])
  media: Media[];
}
