export class OrderResponse {
  id: number;
  username: string;
  number: string;
  status: string;
  total?: number;
  createdAt: Date;
  updatedAt: Date;
  constructor(partial?: Partial<OrderResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
