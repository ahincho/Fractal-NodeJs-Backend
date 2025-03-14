import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 64 })
  name: string;
  @Column({ type: 'varchar', length: 256 })
  image: string;
  @OneToMany(() => ProductEntity, (product) => product.category, { lazy: true })
  products: Promise<ProductEntity[]>;
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
  constructor(partial?: Partial<CategoryEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
