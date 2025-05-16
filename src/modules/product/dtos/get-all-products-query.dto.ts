import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsArray,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { ProductStatus } from '../enums/status.enum';

export enum ProductSortFields {
  name = 'name',
  price = 'price',
  discount = 'discount',
  rating = 'rating',
  stock = 'stock',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

const acceptedFields = [
  'id',
  'name',
  'description',
  'price',
  'discount',
  'rating',
  'stock',
  'status',
  'image_url',
  'createdAt',
  'updatedAt',
];

export class GetAllProductsQueryDto {
  @ApiProperty({ type: 'number', required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiProperty({ type: 'number', required: false, default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiProperty({
    type: 'string',
    enum: ProductSortFields,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductSortFields)
  sortField?: ProductSortFields;

  @ApiProperty({
    type: 'string',
    enum: SortOrder,
    default: SortOrder.ASC,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @ApiProperty({ type: 'number', required: false, minimum: 0 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  minPrice?: number;

  @ApiProperty({ type: 'number', required: false, minimum: 0 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  maxPrice?: number;

  @ApiProperty({
    type: 'string',
    enum: ProductStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value?.length) return acceptedFields;
    const values: string[] = value.split(',');
    const isValid = values.every((el) => acceptedFields.includes(el));
    if (!isValid) {
      throw new BadRequestException(`xato ustun yuborildi: ${value}`);
    }
    return values;
  })
  @IsArray()
  fields?: string[];
}
