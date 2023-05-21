import { Quantification } from '@api/quantification/entities';
import { BaseEntity } from '@base/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @OneToMany(
    () => Quantification,
    (quantification) => quantification.ingredient
  )
  quantification: Quantification[];
}
