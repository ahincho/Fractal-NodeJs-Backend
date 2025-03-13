import { Catch, HttpStatus } from "@nestjs/common";
import { CategoryDuplicateException } from "src/exceptions/category.duplicate.exception";
import { CategoryNotFoundException } from "src/exceptions/category.not.found.exception";
import { BaseHttpExceptionFilter } from "./base.http.exception.filter";

@Catch(CategoryDuplicateException, CategoryNotFoundException)
export class CategoryHttpExceptionFilter extends BaseHttpExceptionFilter<CategoryDuplicateException | CategoryNotFoundException> {
  protected exceptionToStatusMap = new Map<Function, number>([
    [CategoryDuplicateException, HttpStatus.CONFLICT],
    [CategoryNotFoundException, HttpStatus.NOT_FOUND],
  ]);
}
