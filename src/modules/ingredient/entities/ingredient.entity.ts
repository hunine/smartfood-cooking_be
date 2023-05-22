import { Media } from 'src/modules/media/entities';
import { Quantification } from 'src/modules/quantification/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ingredients')
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name: string;

  @OneToMany(
    () => Quantification,
    (quantification) => quantification.ingredient,
  )
  quantification: Quantification[];

  @ManyToMany(() => Media, (media) => media.ingredient)
  @JoinTable({
    name: 'ingredients_media',
    joinColumn: {
      name: 'ingredient_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'media_id',
      referencedColumnName: 'id',
    },
  })
  media: Media[];
}

@Entity('ingredients_media')
export class IngredientMedia {
  @PrimaryColumn({ name: 'ingredient_id' })
  ingredientId: number;

  @PrimaryColumn({ name: 'media_id' })
  mediaId: number;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.media)
  @JoinColumn([{ name: 'ingredient_id', referencedColumnName: 'id' }])
  ingredients: Ingredient[];

  @ManyToOne(() => Media, (media) => media.ingredient)
  @JoinColumn([{ name: 'media_id', referencedColumnName: 'id' }])
  media: Media[];
}
