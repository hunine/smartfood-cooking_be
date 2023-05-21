import { Category } from '@api/category/entities';
import { Cuisine } from '@api/cuisine/entities';
import { Level } from '@api/level/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @ManyToOne(() => Level, (level) => level.recipes)
  @JoinColumn({ name: 'levelId' })
  level: Level;

  @ManyToOne(() => Category, (category) => category.recipes)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Cuisine, (cuisine) => cuisine.recipes)
  @JoinColumn({ name: 'cuisineId' })
  cuisine: Cuisine;
}
