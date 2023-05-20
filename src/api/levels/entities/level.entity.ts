import { Recipe } from '@api/recipes/entities';
import { BaseEntity } from 'src/shared/base';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Level extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @OneToMany(() => Recipe, (recipe) => recipe.level)
  recipes: Recipe[];
}
