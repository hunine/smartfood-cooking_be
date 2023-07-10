import { Media } from '@app/media/entities';
import { Quantification } from '@app/quantification/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AverageWeight } from './average_weight.entity';

@Entity('ingredients')
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public slug?: string;

  @Column({ type: 'float', default: 0 })
  public kcal: number;

  @Column({ type: 'float', default: 0 })
  public carbs: number;

  @Column({ type: 'float', default: 0 })
  public protein: number;

  @Column({ type: 'float', default: 0 })
  public fat: number;

  @OneToMany(
    () => Quantification,
    (quantification) => quantification.ingredient,
  )
  quantification: Quantification[];

  @OneToMany(() => AverageWeight, (averageWeight) => averageWeight.ingredient)
  listAverageWeight: AverageWeight[];

  @ManyToMany(() => Media, (media) => media.ingredient)
  @JoinTable({ name: 'ingredients_media' })
  media: Media[];
}
