import { Recipe } from '@api/recipe/entities';
import { BaseEntity } from 'src/shared/base';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('levels')
export class Level extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @OneToMany(() => Recipe, (recipe) => recipe.level)
  recipes: Recipe[];
}
