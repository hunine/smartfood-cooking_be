import { Media } from '@app/media/entities';
import { BaseEntity } from '@base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', name: 'first_name' })
  public firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  public lastName: string;

  @Column({ type: 'varchar', unique: true })
  public email: string;

  @Column({ type: 'varchar'})
  public password: string;

  @Column({ type: 'decimal', nullable: true })
  public height?: number;

  @Column({ type: 'decimal', nullable: true })
  public weight?: number;

  @OneToOne(() => Media, (media) => media.user)
  @JoinColumn({ name: 'media_id' })
  avatar: Media;
}
