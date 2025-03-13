import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/commons/page.request';
import { PageResponse } from 'src/commons/page.response';
import { CategoryCreateRequest } from 'src/dtos/category.create.request';
import { CategoryResponse } from 'src/dtos/category.response';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryDuplicateException } from 'src/exceptions/category.duplicate.exception';
import { CategoryMapper } from 'src/mappers/category.mapper';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
  ) {}
  async createOneCategory(
    categoryCreateRequest: CategoryCreateRequest,
  ): Promise<CategoryResponse> {
    const exists = await this._categoryRepository.exists({
      where: { name: categoryCreateRequest.name },
    });
    if (exists) {
      throw new CategoryDuplicateException(
        `Category with name '${categoryCreateRequest.name}' already exists`,
      );
    }
    const categoryEntity = CategoryMapper.createRequestToEntity(
      categoryCreateRequest,
    );
    const savedCategoryEntity = await this._categoryRepository.save(categoryEntity);
    console.log(savedCategoryEntity);
    return CategoryMapper.entityToResponse(savedCategoryEntity);
  }
  async findCategories(
    pageRequest: PageRequest,
  ): Promise<PageResponse<CategoryResponse>> {
    const totalItems = await this._categoryRepository
      .createQueryBuilder('category')
      .getCount();
    const categoryEntities = await this._categoryRepository
      .createQueryBuilder('category')
      .skip(pageRequest.page * pageRequest.size)
      .take(pageRequest.size)
      .getMany();
    const categoryResponses = categoryEntities.map(
      CategoryMapper.entityToResponse,
    );
    const totalPages = Math.ceil(totalItems / pageRequest.size);
    const hasNextPage = pageRequest.page < totalPages - 1;
    return new PageResponse<CategoryResponse>({
      totalItems,
      totalPages,
      currentPage: pageRequest.page,
      pageSize: pageRequest.size,
      hasNextPage,
      items: categoryResponses,
    });
  }
}
