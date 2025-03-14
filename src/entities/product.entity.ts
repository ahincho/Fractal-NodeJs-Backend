import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 128 })
  name: string;
  @Column({ type: 'varchar', length: 256 })
  description: string;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;
  @Column({ type: 'int', default: 0 })
  quantity: number;
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Column({ type: 'varchar', length: 256 })
  image: string;
  @ManyToOne(() => CategoryEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
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
  constructor(partial?: Partial<ProductEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
