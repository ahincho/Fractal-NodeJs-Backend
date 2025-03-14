export class ProductDuplicateException extends Error {
  constructor(public readonly message: string) {
    super(message ?? 'Product already exists');
  }
}
