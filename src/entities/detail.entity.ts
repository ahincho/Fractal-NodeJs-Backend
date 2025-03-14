import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'details' })
export class DetailEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => OrderEntity, (order) => order.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
  @Column({ type: 'integer' })
  quantity: number;
  constructor(partial?: Partial<DetailEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
