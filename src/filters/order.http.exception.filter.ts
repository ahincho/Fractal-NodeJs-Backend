import { Catch, HttpStatus } from "@nestjs/common";
import { OrderNotFoundException } from "src/exceptions/order.not.found.exception";
import { OrderValidationException } from "src/exceptions/order.validation.exception";
import { BaseHttpExceptionFilter } from "./base.http.exception.filter";

@Catch(OrderValidationException, OrderNotFoundException)
export class OrderHttpExceptionFilter extends BaseHttpExceptionFilter<OrderValidationException | OrderNotFoundException> {
  protected exceptionToStatusMap = new Map<Function, number>([
    [OrderValidationException, HttpStatus.UNPROCESSABLE_ENTITY],
    [OrderNotFoundException, HttpStatus.NOT_FOUND],
  ]);
}
