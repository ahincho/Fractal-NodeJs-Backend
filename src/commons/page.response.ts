export class PageResponse<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  items: T[];
  constructor(partial?: Partial<PageResponse<T>>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
