export class OrderNotFoundException extends Error {
  constructor(public readonly message: string) {
    super(message ?? 'Order not found');
  }
}
