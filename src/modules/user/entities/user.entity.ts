import { Media } from '@app/media/entities';
import { RecipeRating } from '@app/recipe-rating/entities';
import { BaseEntity } from '@base/base.entity';
import { Gender } from 'src/common/enums/gender.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', name: 'first_name' })
  public firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  public lastName: string;

  @Column({ type: 'varchar', unique: true })
  public email: string;

  @Column({ type: 'varchar' })
  public password: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  public gender?: Gender;

  @Column({ type: 'varchar', nullable: true })
  public age?: number;

  @Column({ type: 'decimal', nullable: true })
  public height?: number;

  @Column({ type: 'decimal', nullable: true })
  public weight?: number;

  @OneToOne(() => Media, (media) => media.user)
  @JoinColumn({ name: 'media_id' })
  avatar: Media;

  @OneToMany(() => RecipeRating, (recipeRating) => recipeRating.user)
  recipeRating: RecipeRating[];
}
