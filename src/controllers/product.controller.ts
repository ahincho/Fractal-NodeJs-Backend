import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PageRequest } from 'src/commons/page.request';
import { ProductCreateRequest } from 'src/dtos/product.create.request';
import { ProductResponse } from 'src/dtos/product.response';
import { ProductService } from 'src/services/product.service';
import { Request, Response } from 'express';
import { ProductUpdateRequest } from 'src/dtos/product.update.request';

@Controller('/api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOneProduct(
    @Req() request: Request,
    @Res() response: Response,
    @Body() productCreateRequest: ProductCreateRequest,
  ): Promise<void> {
    const productResponse =
      await this.productService.createOneProduct(productCreateRequest);
    const location = `${request.protocol}://${request.get('host')}/api/v1/products/${productResponse.id}`;
    response.setHeader('Location', location);
    response.status(HttpStatus.CREATED).json(productResponse).send();
  }
  @Get()
  async findProducts(
    @Res() response: Response,
    @Query() pageRequest: PageRequest,
  ): Promise<void> {
    const productResponses =
      await this.productService.findProducts(pageRequest);
    if (productResponses.items.length === 0) {
      response.status(HttpStatus.NO_CONTENT).send();
      return;
    }
    response.status(HttpStatus.OK).json(productResponses);
  }
  @Get(':productId')
  async findOneProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductResponse> {
    return await this.productService.findOneProductById(productId);
  }
  @Patch(':orderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOneProduct(
    @Param('orderId', ParseIntPipe) productId: number,
    @Body() productUpdateRequest: ProductUpdateRequest,
  ): Promise<void> {
    await this.productService.updateOneProductById(
      productId,
      productUpdateRequest,
    );
  }
  @Delete(':productId')
  async deleteOneProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    await this.productService.deleteOneProductById(productId);
  }
}
