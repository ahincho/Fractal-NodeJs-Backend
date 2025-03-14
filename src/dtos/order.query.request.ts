import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class OrderQueryRequest {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  readonly page: number = 0;
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(50)
  readonly size: number = 10;
  @IsOptional()
  @IsString()
  readonly username: string;
}
