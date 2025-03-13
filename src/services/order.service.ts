import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageResponse } from 'src/commons/page.response';
import { OrderCreateRequest } from 'src/dtos/order.create.request';
import { OrderCreateResponse } from 'src/dtos/order.create.response';
import { OrderDetailsResponse } from 'src/dtos/order.details.response';
import { OrderQueryRequest } from 'src/dtos/order.query.request';
import { OrderResponse } from 'src/dtos/order.response';
import { DetailEntity } from 'src/entities/detail.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { OrderNotFoundException } from 'src/exceptions/order.not.found.exception';
import { OrderValidationException } from 'src/exceptions/order.validation.exception';
import { ProductNotFoundException } from 'src/exceptions/product.not.found.exception';
import { OrderMapper } from 'src/mappers/order.mapper';
import { In, Repository } from 'typeorm';
import { v7 as uuid } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly _orderRepository: Repository<OrderEntity>,
    @InjectRepository(DetailEntity)
    private readonly _detailRepository: Repository<DetailEntity>,
    @InjectRepository(ProductEntity)
    private readonly _productRepository: Repository<ProductEntity>,
  ) {}
  async createOneOrder(
    orderCreateRequest: OrderCreateRequest,
  ): Promise<OrderCreateResponse> {
    const productIds = orderCreateRequest.details.map(
      (detail) => detail.productId,
    );
    const existingProducts = await this._productRepository.find({
      where: { id: In(productIds) },
    });
    const existingProductIds = existingProducts.map((product) => product.id);
    const missingProductIds = productIds.filter(
      (id) => !existingProductIds.includes(id),
    );
    if (missingProductIds.length > 0) {
      throw new ProductNotFoundException(
        `The following product(s) id(s) were not found: ${missingProductIds.join(', ')}`,
      );
    }
    const productMap = new Map(
      existingProducts.map((product) => [product.id, product]),
    );
    const insufficientStockProducts = orderCreateRequest.details
      .filter((detail) => {
        const product = productMap.get(detail.productId);
        return product && product.quantity < detail.quantity;
      })
      .map((detail) => detail.productId);
    if (insufficientStockProducts.length > 0) {
      throw new OrderValidationException(
        `Insufficient stock for product(s) with id(s): ${insufficientStockProducts.join(', ')}`,
      );
    }
    const orderEntity = await this._orderRepository.save(
      this._orderRepository.create({
        username: orderCreateRequest.username,
        number: `ORD-${uuid()}`,
      }),
    );
    const details = orderCreateRequest.details.map((detail) => {
      return this._detailRepository.create({
        order: orderEntity,
        product: { id: detail.productId } as ProductEntity,
        quantity: detail.quantity,
      });
    });
    await this._detailRepository.save(details);
    return new OrderCreateResponse({
      id: orderEntity.id,
      username: orderEntity.username,
      number: orderEntity.number,
    });
  }
  async findOrders(orderQueryRequest: OrderQueryRequest): Promise<PageResponse<OrderResponse>> {
    const { page, size, username } = orderQueryRequest;
    const skip = page * size;
    const take = size;
    const totalItems = await this._orderRepository.count({
      where: username ? { username } : {},
    });
    const orders = await this._orderRepository.find({
      where: username ? { username } : {},
      skip,
      take,
      order: { id: 'ASC' },
    });
    const orderResponses = orders.map(OrderMapper.entityToResponse);
    const totalPages = Math.ceil(totalItems / size);
    const hasNextPage = page < totalPages - 1;
      return new PageResponse<OrderResponse>({
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: size,
      hasNextPage,
      items: orderResponses,
    });
  }
  async findOneOrderById(orderId: number): Promise<OrderResponse> {
    const orderEntity = await this._orderRepository.findOne({ where: { id: orderId } });
    if (!orderEntity) {
      throw new OrderNotFoundException(`Order with id '${orderId}' not found`);
    }
    return OrderMapper.entityToResponse(orderEntity);
  }
  async deleteOneOrderById(orderId: number): Promise<void> {
    const exists = await this._orderRepository.exists({ where: { id: orderId } });
    if (!exists) {
      throw new OrderNotFoundException(`Order with id '${orderId}' not found`);
    }
    await this._orderRepository.delete(orderId);
  }
}
