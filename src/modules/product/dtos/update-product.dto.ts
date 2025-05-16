import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export enum ProductStatus {
  ACTIVE = 'active',
  OUT_OF_STOCK = 'out_of_stock',
  INACTIVE = 'inactive',
}

export class UpdateProductDto {
  @ApiProperty({
    type: 'string',
    example: 'New Product Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: 'string',
    example: 'Product description here',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'number',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({
    type: 'number',
    example: 10,
    description: 'updated product',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @ApiProperty({
    type: 'number',
    example: 4.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({
    type: 'number',
    example: 50,
    description: 'stock count',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock?: number;

}
