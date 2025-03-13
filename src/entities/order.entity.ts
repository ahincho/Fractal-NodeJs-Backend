import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetailEntity } from './detail.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 64, nullable: false })
  number: string;
  @Column({ type: 'varchar', length: 32, nullable: false })
  username: string;
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  @OneToMany(() => DetailEntity, (detail) => detail.order, { lazy: true })
  details: Promise<DetailEntity[]>;
  constructor(partial?: Partial<OrderEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
