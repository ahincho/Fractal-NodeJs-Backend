import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OrderCreateRequest } from 'src/dtos/order.create.request';
import { OrderDetailsResponse } from 'src/dtos/order.details.response';
import { OrderQueryRequest } from 'src/dtos/order.query.request';
import { OrderService } from 'src/services/order.service';

@Controller('/api/v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOneOrder(
    @Req() request: Request,
    @Res() response: Response,
    @Body() orderCreateRequest: OrderCreateRequest,
  ): Promise<void> {
    const orderCreateResponse =
      await this.orderService.createOneOrder(orderCreateRequest);
    const location = `${request.protocol}://${request.get('host')}/api/v1/products/${orderCreateResponse.id}`;
    response.setHeader('Location', location);
    response.status(HttpStatus.CREATED).json(orderCreateResponse).send();
  }
  @Get()
  async findOrders(
    @Res() response: Response,
    @Query() orderQueryRequest: OrderQueryRequest,
  ): Promise<void> {
    const orderResponses =
      await this.orderService.findOrders(orderQueryRequest);
    if (orderResponses.items.length === 0) {
      response.status(HttpStatus.NO_CONTENT).send();
      return;
    }
    response.status(HttpStatus.OK).json(orderResponses);
  }
  @Get(':orderId')
  async findOneOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderDetailsResponse> {
    return await this.orderService.findOneOrderById(orderId);
  }
  @Delete(':orderId')
  async deleteOneOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<void> {
    return await this.orderService.deleteOneOrderById(orderId);
  }
}
