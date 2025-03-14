import { ProductCreateRequest } from 'src/dtos/product.create.request';
import { ProductResponse } from 'src/dtos/product.response';
import { ProductUpdateRequest } from 'src/dtos/product.update.request';
import { CategoryEntity } from 'src/entities/category.entity';
import { ProductEntity } from 'src/entities/product.entity';

export class ProductMapper {
  static createRequestToEntity(
    productCreateRequest: ProductCreateRequest,
    category: CategoryEntity,
  ): ProductEntity {
    return new ProductEntity({
      name: productCreateRequest.name,
      description: productCreateRequest.description,
      price: Number(productCreateRequest.price.toFixed(2)),
      quantity: productCreateRequest.quantity,
      image: productCreateRequest.image,
      category,
    });
  }
  static updateRequestToEntity(
    productId: number,
    productUpdateRequest: ProductUpdateRequest,
  ): ProductEntity {
    const updatedProduct = new ProductEntity();
    updatedProduct.id = productId;
    Object.assign(updatedProduct, productUpdateRequest);
    return updatedProduct;
  }
  static entityToResponse(productEntity: ProductEntity): ProductResponse {
    return new ProductResponse({
      id: productEntity.id,
      name: productEntity.name,
      description: productEntity.description,
      price: Number(productEntity.price.toFixed(2)),
      quantity: productEntity.quantity,
      image: productEntity.image,
      category: productEntity.category?.name ?? 'Empty Category',
      createdAt: productEntity.createdAt,
      updatedAt: productEntity.updatedAt,
    });
  }
}
