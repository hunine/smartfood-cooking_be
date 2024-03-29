import { Category } from 'src/modules/category/entities';
import { Cuisine } from 'src/modules/cuisine/entities';
import { Level } from 'src/modules/level/entities';
import { Media } from 'src/modules/media/entities';
import { Quantification } from 'src/modules/quantification/entities';
import { RecipeStep } from 'src/modules/recipe-step/entities';
import { RecipeRating } from '@app/recipe-rating/entities';
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
import { Meal } from '@app/meal/entities';

@Entity('recipes')
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'float', default: 0 })
  public rating: number;

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

  @OneToMany(() => RecipeRating, (recipeRating) => recipeRating.recipe)
  recipeRating: RecipeRating[];

  @OneToMany(() => Meal, (meal) => meal.recipe)
  meals: Meal[];

  @ManyToMany(() => Media, (media) => media.recipe)
  @JoinTable({ name: 'recipes_media' })
  media: Media[];
}
