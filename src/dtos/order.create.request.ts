import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsString,
  Matches,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetailCreateRequest } from './detail.create.request';

export class OrderCreateRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 32)
  @Matches(/^[a-zA-Z0-9]{1,32}$/)
  readonly username: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DetailCreateRequest)
  readonly details: DetailCreateRequest[];
}
