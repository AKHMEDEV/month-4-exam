import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './model/product.model';
import { JwtService } from '@nestjs/jwt';
import { FsHelper, JwtHelper } from '@helpers';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, JwtService, JwtHelper, FsHelper],
})
export class ProductModule {}
