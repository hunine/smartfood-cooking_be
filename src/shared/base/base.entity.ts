import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  public deletedAt: Date;
}
