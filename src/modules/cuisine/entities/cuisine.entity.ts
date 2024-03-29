import { Recipe } from 'src/modules/recipe/entities';
import { BaseEntity } from '@base/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cuisine extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @OneToMany(() => Recipe, (recipe) => recipe.cuisine)
  recipes: Recipe[];
}
