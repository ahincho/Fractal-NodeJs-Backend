import { DetailResponse } from 'src/dtos/detail.response';
import { OrderDetailsResponse } from 'src/dtos/order.details.response';
import { DetailEntity } from 'src/entities/detail.entity';
import { OrderEntity } from 'src/entities/order.entity';

export class OrderMapper {
  static async orderEntityToResponse(
    orderEntity: OrderEntity,
    detailEntities?: DetailEntity[],
  ): Promise<OrderDetailsResponse> {
    const orderDetails = detailEntities ?? (await orderEntity.details);
    const detailResponses = await Promise.all(
      orderDetails.map(async (detailEntity) => {
        return OrderMapper.detailEntityToResponse(detailEntity);
      }),
    );
    const total = orderDetails.reduce((sum, detail) => {
      return (
        sum + (detail.product ? detail.quantity * detail.product.price : 0)
      );
    }, 0);
    const roundedTotal = parseFloat(total.toFixed(2));
    return new OrderDetailsResponse({
      id: orderEntity.id,
      username: orderEntity.username,
      number: orderEntity.number,
      details: detailResponses,
      total: roundedTotal,
      createdAt: orderEntity.createdAt,
      updatedAt: orderEntity.updatedAt,
    });
  }
  static async detailEntityToResponse(
    detail: DetailEntity,
  ): Promise<DetailResponse> {
    const product = detail.product ? detail.product : null;
    return new DetailResponse({
      id: detail.id,
      product: product ? product.name : 'Unknown',
      price: product ? product.price : 0.0,
      quantity: detail.quantity,
    });
  }
}
