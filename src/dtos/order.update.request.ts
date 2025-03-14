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
import { DetailUpdateRequest } from './detail.update.request';

export class OrderUpdateRequest {
  @IsNotEmpty()
  @IsString()
  @Length(1, 32)
  @Matches(/^[a-zA-Z0-9]{1,32}$/)
  readonly username: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DetailUpdateRequest)
  readonly details: DetailUpdateRequest[];
}
