import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsUrl,
} from 'class-validator';
import { ProductStatus } from '../enums/status.enum';

export class CreateProductDto {
  @ApiProperty({
    type: 'string',
    example: 'iphone 16 pro',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'yaxshi telefon',
    required: true,
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    type: 'number',
    example: 999.99,
    minimum: 0,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    type: 'number',
    example: 10,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({
    type: 'number',
    example: 4.5,
    minimum: 0,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rating?: number;

  @ApiProperty({
    type: 'number',
    example: 50,
    minimum: 0,
    required: true,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    type: 'string',
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
    required: true,
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({
    type: 'string',
    example: 'rasm linki booladi ',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;
}
