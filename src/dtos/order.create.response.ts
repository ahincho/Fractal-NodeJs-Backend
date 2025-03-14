export class OrderCreateResponse {
  id: number;
  username: string;
  number: string;
  constructor(partial?: Partial<OrderCreateResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
