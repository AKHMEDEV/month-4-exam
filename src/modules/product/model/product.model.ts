import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ProductStatus } from '../enums/status.enum';

@Table({ tableName: 'products', timestamps: true })
export class Product extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  discount: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  rating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(ProductStatus),
    defaultValue: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image_url?: string;
}
