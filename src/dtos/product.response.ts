export class ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(partial?: Partial<ProductResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
