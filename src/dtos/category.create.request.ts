import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CategoryCreateRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  name: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  image: string;
}
