export class ProductNotFoundException extends Error {
  constructor(public readonly message: string) {
    super(message ?? 'Product not found');
  }
}
