import { BaseEntity } from '@base/base.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cooking_histories')
export class CookingHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'recipe_id', type: 'uuid' })
  recipeId: string;
}
