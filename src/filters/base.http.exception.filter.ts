import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ExceptionResponse } from 'src/commons/exception.response';
import { Response, Request } from 'express';

export abstract class BaseHttpExceptionFilter<T extends Error> implements ExceptionFilter {
  protected abstract exceptionToStatusMap: Map<Function, number>;
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const path = request.url;
    const method = request.method;
    const status: number = this.exceptionToStatusMap.get(exception.constructor) ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const statusDescription = HttpStatus[status] || 'Internal server error';
    const message = exception.message || 'Internal server error';
    const exceptionResponse = new ExceptionResponse({
      path,
      method,
      statusCode: status,
      statusDescription,
      message,
    });
    response.status(status).json(exceptionResponse);
  }
}
