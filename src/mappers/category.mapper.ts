import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryResponse } from 'src/dtos/category.response';
import { CategoryCreateRequest } from 'src/dtos/category.create.request';

export class CategoryMapper {
  static createRequestToEntity(
    categoryCreateRequest: CategoryCreateRequest,
  ): CategoryEntity {
    return new CategoryEntity({
      name: categoryCreateRequest.name,
      image: categoryCreateRequest.image,
    });
  }
  static entityToResponse(categoryEntity: CategoryEntity): CategoryResponse {
    return new CategoryResponse({
      id: categoryEntity.id,
      name: categoryEntity.name,
      image: categoryEntity.image,
      createdAt: categoryEntity.createdAt,
      updatedAt: categoryEntity.updatedAt,
    });
  }
}
