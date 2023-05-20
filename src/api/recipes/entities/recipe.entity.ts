import { BaseEntity } from 'src/shared/base';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;
}
