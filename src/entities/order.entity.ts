import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetailEntity } from './detail.entity';
import { OrderStatus } from './order.status.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 64, nullable: false })
  number: string;
  @Column({ type: 'varchar', length: 32, nullable: false })
  username: string;
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    nullable: false,
  })
  status: OrderStatus;
  @Column({
    type: 'decimal',
    precision: 24,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
    nullable: true,
  })
  total?: number;
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: false,
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
