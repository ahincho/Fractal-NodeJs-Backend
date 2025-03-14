import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class ProductCreateRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  name: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  description: string;
  @IsNotEmpty()
  @IsPositive()
  price: number;
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  image: string;
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  categoryId: number;
}
