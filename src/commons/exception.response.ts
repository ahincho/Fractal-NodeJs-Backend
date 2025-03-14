export class ExceptionResponse {
  path: string;
  method: string;
  statusCode: number;
  statusDescription: string;
  message: string;
  constructor(partial?: Partial<ExceptionResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
