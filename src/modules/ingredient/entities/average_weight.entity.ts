import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Entity('average_weight')
export class AverageWeight extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public unit: string;

  @Column({ type: 'float', default: 0 })
  public gram: number;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.listAverageWeight)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
}
