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

@Entity('ingredients')
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public slug?: string;

  @OneToMany(
    () => Quantification,
    (quantification) => quantification.ingredient,
  )
  quantification: Quantification[];

  @ManyToMany(() => Media, (media) => media.ingredient)
  @JoinTable({ name: 'ingredients_media' })
  media: Media[];
}
