import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CategoryService } from 'src/services/category.service';
import { PageRequest } from 'src/commons/page.request';
import { CategoryCreateRequest } from 'src/dtos/category.create.request';
import { Request, Response } from 'express';

@Controller('/api/v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOneCategory(
    @Req() request: Request,
    @Res() response: Response,
    @Body() categoryCreateRequest: CategoryCreateRequest,
  ) {
    const categoryResponse = await this.categoryService.createOneCategory(
      categoryCreateRequest,
    );
    const location = `${request.protocol}://${request.get('host')}/api/v1/categories/${categoryResponse.id}`;
    response.setHeader('Location', location);
    response.status(HttpStatus.CREATED).json(categoryResponse).send();
  }
  @Get()
  async findCategories(
    @Res() response: Response,
    @Query() pageRequest: PageRequest,
  ): Promise<void> {
    const categoryResponses =
      await this.categoryService.findCategories(pageRequest);
    if (categoryResponses.items.length === 0) {
      response.status(HttpStatus.NO_CONTENT).send();
      return;
    }
    response.status(HttpStatus.OK).json(categoryResponses);
  }
}
