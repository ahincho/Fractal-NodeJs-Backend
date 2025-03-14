export class OrderValidationException extends Error {
  constructor(public readonly message: string) {
    super(message ?? 'Order is not valid');
  }
}
