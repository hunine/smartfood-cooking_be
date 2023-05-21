import { Recipe } from '@api/recipe/entities';
import { BaseEntity } from '@base/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @OneToMany(() => Recipe, (recipe) => recipe.category)
  recipes: Recipe[];
}
