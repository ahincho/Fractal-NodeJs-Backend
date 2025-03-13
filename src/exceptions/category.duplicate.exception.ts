export class CategoryDuplicateException extends Error {
  constructor(public readonly message: string) {
    super(message ?? 'Category already exists');
  }
}
