import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRoles } from '../users/enums';
import { ProductService } from './product.service';
import { GetAllProductsQueryDto } from './dtos/get-all-products-query.dto';
import { Protected, Roles } from '@decorators';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UpdateProductImageDto } from './dtos/update-prduct.image';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckFileSizePipe } from './pipes';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @ApiOperation({ summary: 'all products' })
  @ApiBearerAuth()
  @Get()
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async getAll(@Query() queries: GetAllProductsQueryDto) {
    return await this.service.getAll(queries);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create product' })
  @Post()
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async create(@Body() payload: CreateProductDto) {
    return await this.service.create(payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update product' })
  @Patch(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async update(
    @Body() payload: UpdateProductDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.service.update(id, payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'add and update image' })
  @ApiConsumes('multipart/form-data')
  @Put(':id/image')
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  @UseInterceptors(FileInterceptor('image'))
  async updateProductImage(
    @Body() payload: UpdateProductImageDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(new CheckFileSizePipe(1)) image: Express.Multer.File,
  ) {
    return await this.service.updateImage(id, { image });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete product' })
  @Delete(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
