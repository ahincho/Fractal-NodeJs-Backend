export class DetailResponse {
  id: number;
  product: string;
  price: number;
  quantity: number;
  constructor(partial?: Partial<DetailResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
