import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PageResponse } from "src/commons/page.response";
import { OrderDetailsResponse } from "src/dtos/order.details.response";
import { OrderQueryRequest } from "src/dtos/order.query.request";
import { DetailEntity } from "src/entities/detail.entity";
import { OrderEntity } from "src/entities/order.entity";
import { ProductEntity } from "src/entities/product.entity";
import { OrderNotFoundException } from "src/exceptions/order.not.found.exception";
import { OrderMapper } from "src/mappers/order.mapper";
import { In, Repository } from "typeorm";

@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly _productRepository: Repository<ProductEntity>,
    @InjectRepository(OrderEntity)
    private readonly _orderRepository: Repository<OrderEntity>,
    @InjectRepository(DetailEntity)
    private readonly _detailRepository: Repository<DetailEntity>,
  ) {}
  async findDetails(
    orderQueryRequest: OrderQueryRequest,
  ): Promise<PageResponse<OrderDetailsResponse>> {
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
    if (orders.length === 0) {
      return new PageResponse<OrderDetailsResponse>({
        totalItems,
        totalPages: Math.ceil(totalItems / size),
        currentPage: page,
        pageSize: size,
        hasNextPage: page < Math.ceil(totalItems / size) - 1,
        items: [],
      });
    }
    const orderIds = orders.map((order) => order.id);
    const orderDetails = await this._detailRepository.find({
      where: { order: In(orderIds) },
      relations: ['order', 'product'],
      loadEagerRelations: false,
    });
    const orderMap = new Map<number, DetailEntity[]>();
    orderDetails.forEach((detail) => {
      if (!orderMap.has(detail.order.id)) {
        orderMap.set(detail.order.id, []);
      }
      orderMap.get(detail.order.id)!.push(detail);
    });
    const orderResponses = await Promise.all(
      orders.map(async (order) =>
        OrderMapper.orderDetailsToResponse(order, orderMap.get(order.id) || []),
      ),
    );
    const totalPages = Math.ceil(totalItems / size);
    const hasNextPage = page < totalPages - 1;
    return new PageResponse<OrderDetailsResponse>({
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: size,
      hasNextPage,
      items: orderResponses,
    });
  }
  async findOneDetailById(orderId: number): Promise<OrderDetailsResponse> {
    const order = await this._orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new OrderNotFoundException(`Order with id '${orderId}' not found`);
    }
    const orderDetails = await this._detailRepository.find({
      where: { order: { id: orderId } },
      relations: ['product'],
      loadEagerRelations: false,
    });
    return OrderMapper.orderDetailsToResponse(order, orderDetails);
  }
  async deleteOneOrderById(orderId: number): Promise<void> {
    const exists = await this._orderRepository.exists({
      where: { id: orderId },
    });
    if (!exists) {
      throw new OrderNotFoundException(`Order with id '${orderId}' not found`);
    }
    await this._orderRepository.delete(orderId);
  }
}
