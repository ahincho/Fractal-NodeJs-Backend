export class CategoryResponse {
  id: number;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(partial?: Partial<CategoryResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
