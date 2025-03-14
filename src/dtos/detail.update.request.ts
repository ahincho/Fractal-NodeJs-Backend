import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class DetailUpdateRequest {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly productId: number;
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly quantity: number;
}
