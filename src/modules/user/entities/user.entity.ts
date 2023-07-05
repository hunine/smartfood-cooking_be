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
import { Diary } from '@app/diary/entities';
import { PracticeModeLabel } from 'src/common/enums/practice-mode.enum';

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

  @Column({ type: 'int', nullable: true })
  public age?: number;

  @Column({ type: 'float', nullable: true })
  public height?: number;

  @Column({ type: 'float', nullable: true })
  public weight?: number;

  @Column({ type: 'varchar', name: 'start_nutrition_date', nullable: true })
  public startNutritionDate?: string;

  @Column({
    type: 'enum',
    enum: PracticeModeLabel,
    name: 'practice_mode',
    nullable: true,
  })
  public practiceMode?: string;

  @OneToOne(() => Media, (media) => media.user)
  @JoinColumn({ name: 'media_id' })
  avatar: Media;

  @OneToMany(() => RecipeRating, (recipeRating) => recipeRating.user)
  recipeRating: RecipeRating[];

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];
}
