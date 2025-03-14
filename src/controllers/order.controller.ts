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
import { DetailService } from 'src/services/detail.service';
import { OrderService } from 'src/services/order.service';
import { OrderCreateRequest } from 'src/dtos/order.create.request';
import { OrderDetailsResponse } from 'src/dtos/order.details.response';
import { OrderQueryRequest } from 'src/dtos/order.query.request';
import { OrderResponse } from 'src/dtos/order.response';
import { Request, Response } from 'express';
import { OrderUpdateRequest } from 'src/dtos/order.update.request';

@Controller('/api/v1/orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly detailService: DetailService,
  ) {}
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
    const orderResponses = await this.orderService.findOrders(orderQueryRequest);
    if (orderResponses.items.length === 0) {
      response.status(HttpStatus.NO_CONTENT).send();
      return;
    }
    response.status(HttpStatus.OK).json(orderResponses);
  }
  @Get('/details')
  async findOrdersDetails(
    @Res() response: Response,
    @Query() orderQueryRequest: OrderQueryRequest,
  ): Promise<void> {
    const orderDetailResponses = await this.detailService.findDetails(orderQueryRequest);
    if (orderDetailResponses.items.length === 0) {
      response.status(HttpStatus.NO_CONTENT).send();
      return;
    }
    response.status(HttpStatus.OK).json(orderDetailResponses);
  }
  @Get(':orderId')
  async findOneOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderResponse> {
    return await this.orderService.findOneOrderById(orderId);
  }
  @Get('/details/:orderId')
  async findOneOrderDetails(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderDetailsResponse> {
    return await this.detailService.findOneDetailById(orderId);
  }
  @Patch(':orderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOneOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() orderUpdateRequest: OrderUpdateRequest,
  ): Promise<void> {
    return await this.orderService.updateOneOrderById(orderId, orderUpdateRequest);
  }
  @Delete(':orderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOneOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<void> {
    return await this.orderService.deleteOneOrderById(orderId);
  }
}
