import { DetailResponse } from './detail.response';

export class OrderDetailsResponse {
  id: number;
  username: string;
  number: string;
  details: DetailResponse[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
  constructor(partial?: Partial<OrderDetailsResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
