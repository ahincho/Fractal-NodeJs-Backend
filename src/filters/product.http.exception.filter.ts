import { Catch, HttpStatus } from "@nestjs/common";
import { ProductDuplicateException } from "src/exceptions/product.duplicate.exception";
import { ProductNotFoundException } from "src/exceptions/product.not.found.exception";
import { BaseHttpExceptionFilter } from "./base.http.exception.filter";

@Catch(ProductDuplicateException, ProductNotFoundException)
export class ProductHttpExceptionFilter extends BaseHttpExceptionFilter<ProductDuplicateException | ProductNotFoundException> {
  protected exceptionToStatusMap = new Map<Function, number>([
    [ProductDuplicateException, HttpStatus.CONFLICT],
    [ProductNotFoundException, HttpStatus.NOT_FOUND],
  ]);
}
