import { PartialType } from '@nestjs/swagger';
import { ProductCreateRequest } from './product.create.request';

export class ProductUpdateRequest extends PartialType(ProductCreateRequest) {}
