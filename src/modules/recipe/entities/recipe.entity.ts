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
  @JoinTable({ name: 'recipes_media' })
  media: Media[];
}
