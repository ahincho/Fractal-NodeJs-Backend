export class CategoryNotFoundException extends Error {
  constructor(public readonly message: string) {
    super(message ?? 'Category not found');
  }
}
