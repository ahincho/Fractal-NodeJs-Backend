import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/commons/page.request';
import { PageResponse } from 'src/commons/page.response';
import { ProductCreateRequest } from 'src/dtos/product.create.request';
import { ProductResponse } from 'src/dtos/product.response';
import { ProductUpdateRequest } from 'src/dtos/product.update.request';
import { CategoryEntity } from 'src/entities/category.entity';
import { DetailEntity } from 'src/entities/detail.entity';
import { OrderEntity } from 'src/entities/order.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { CategoryNotFoundException } from 'src/exceptions/category.not.found.exception';
import { ProductDuplicateException } from 'src/exceptions/product.duplicate.exception';
import { ProductNotFoundException } from 'src/exceptions/product.not.found.exception';
import { ProductMapper } from 'src/mappers/product.mapper';
import { Not, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly _productRepository: Repository<ProductEntity>,
    @InjectRepository(OrderEntity)
    private readonly _orderRepository: Repository<OrderEntity>,
    @InjectRepository(DetailEntity)
    private readonly _detailRepository: Repository<DetailEntity>,
  ) {}
  async createOneProduct(
    productCreateRequest: ProductCreateRequest,
  ): Promise<ProductResponse> {
    const exists = await this._productRepository.exists({
      where: { name: productCreateRequest.name },
    });
    if (exists) {
      throw new ProductDuplicateException(
        `Product with name '${productCreateRequest.name}' already exists`,
      );
    }
    const category = await this._categoryRepository.findOne({
      where: { id: productCreateRequest.categoryId },
    });
    if (!category) {
      throw new CategoryNotFoundException(
        `Category with id '${productCreateRequest.categoryId}' not found.`,
      );
    }
    const productEntity = ProductMapper.createRequestToEntity(
      productCreateRequest,
      category,
    );
    const savedProductEntity =
      await this._productRepository.save(productEntity);
    return ProductMapper.entityToResponse(savedProductEntity);
  }
  async findProducts(
    pageRequest: PageRequest,
  ): Promise<PageResponse<ProductResponse>> {
    const [productEntities, totalItems] = await this._productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.id', 'ASC')
      .offset(pageRequest.page * pageRequest.size)
      .limit(pageRequest.size)
      .getManyAndCount();
    const productResponses = productEntities.map(ProductMapper.entityToResponse);
    const totalPages = Math.ceil(totalItems / pageRequest.size);
    const hasNextPage = (pageRequest.page + 1) < totalPages;
    return new PageResponse<ProductResponse>({
      totalItems,
      totalPages,
      currentPage: pageRequest.page,
      pageSize: pageRequest.size,
      hasNextPage,
      items: productResponses,
    });
  }
  async findOneProductById(productId: number): Promise<ProductResponse> {
    const productEntity = await this._productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id = :id', { id: productId })
      .getOne();
    if (!productEntity) {
      throw new ProductNotFoundException(
        `Product with id '${productId}' not found`,
      );
    }
    return ProductMapper.entityToResponse(productEntity);
  }
  async updateOneProductById(
    productId: number,
    productUpdateRequest: ProductUpdateRequest,
  ): Promise<void> {
    const productEntity = await this._productRepository.find({
      where: { id: productId },
    });
    if (!productEntity) {
      throw new ProductNotFoundException(
        `Product with id '${productId} not found'`,
      );
    }
    const conflict = await this._productRepository.exists({
      where: { id: Not(productId), name: productUpdateRequest.name },
    });
    if (conflict) {
      throw new ProductDuplicateException(
        `Product with name '${productUpdateRequest.name}' already exists`,
      );
    }
    const productEntityUpdated = ProductMapper.updateRequestToEntity(
      productId,
      productUpdateRequest,
    );
    await this._productRepository.save(productEntityUpdated);
  }
  async deleteOneProductById(productId: number): Promise<void> {
    const exists = await this._productRepository.exists({
      where: { id: productId },
    });
    if (!exists) {
      throw new ProductNotFoundException(
        `Product with id '${productId}' not found`,
      );
    }
    const details = await this._detailRepository.find({
      where: { product: { id: productId } },
      relations: ['order'],
    });
    const affectedOrders = new Set(
      details.map((detail: { order: { id: number } }) => detail.order.id),
    );
    await this._productRepository.delete(productId);
    for (const orderId of affectedOrders) {
      const detailsCount = await this._detailRepository.count({
        where: { order: { id: orderId } },
      });
      if (detailsCount === 0) {
        await this._orderRepository.delete(orderId);
      }
    }
  }
}
