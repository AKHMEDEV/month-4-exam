import { Op } from 'sequelize';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './model/product.model';
import { GetAllProductsQueryDto } from './dtos/get-all-products-query.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UpdateProductImageDto } from './dtos/update-prduct.image';
import { FsHelper } from '@helpers';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private fsHelper: FsHelper,
  ) {}

  async onModuleInit() {
    await this.defaultproducts();
  }

  async getAll(queries: GetAllProductsQueryDto) {
    let filters: any = {};

    if (queries.minPrice) {
      filters.price = {
        [Op.gte]: queries.minPrice,
      };
    }

    if (queries.maxPrice) {
      filters.price = {
        ...filters.price,
        [Op.lte]: queries.maxPrice,
      };
    }

    if (queries.status) {
      filters.status = {
        [Op.eq]: queries.status,
      };
    }

    const limit = queries.limit || 10;
    const page = queries.page || 1;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await this.productModel.findAndCountAll({
      limit,
      offset,
      order: queries.sortField
        ? [[queries.sortField, queries.sortOrder || 'DESC']]
        : undefined,
      where: { ...filters },
      attributes: queries.fields,
    });

    return {
      count,
      limit,
      page,
      data: products,
    };
  }

  async create(payload: CreateProductDto) {
    const existingProduct = await this.productModel.findOne({
      where: { name: payload.name },
    });

    if (existingProduct) {
      throw new ConflictException('product already exists');
    }

    const product = await this.productModel.create({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      discount: payload.discount || 0,
      rating: payload.rating || 0,
      stock: payload.stock,
      status: payload.status,
      image_url: payload.image_url,
    });

    return {
      message: 'created',
      data: product,
    };
  }

  async update(id: number, payload: UpdateProductDto) {
    const foundedProduct = await this.productModel.findByPk(id);

    if (!foundedProduct) {
      throw new ConflictException('not found');
    }

    const [_, [updatedProduct]] = await this.productModel.update(
      {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        discount: payload.discount,
        rating: payload.rating,
        stock: payload.stock,
      },
      { where: { id }, returning: true },
    );

    return {
      message: 'success',
      data: updatedProduct,
    };
  }

  async updateImage(id: number, payload: UpdateProductImageDto) {
    const foundedProduct = await this.productModel.findByPk(id);

    if (!foundedProduct) {
      throw new NotFoundException('not found');
    }

    if (foundedProduct.image_url) {
      await this.fsHelper.removeFiles(foundedProduct.image_url);
    }

    const image = await this.fsHelper.uploadFile(payload.image);

    await this.productModel.update({ image: image.fileUrl }, { where: { id } });

    return {
      message: 'image updated',
    };
  }

  async delete(id: number) {
    const foundedProduct = await this.productModel.findByPk(id);

    if (!foundedProduct) {
      throw new NotFoundException('not found');
    }

    if (foundedProduct.image_url) {
      await this.fsHelper.removeFiles(foundedProduct.image_url);
    }
    await this.productModel.destroy({ where: { id } });

    return {
      message: 'deleted',
      data: foundedProduct,
    };
  }

  async defaultproducts() {
    const defaultProducts = [
      {
        name: 'Laptop',
        price: 1200,
        description: 'Yuqori sifatli laptop',
        category: 'Elektronika',
      },
      {
        name: 'Smartphone',
        price: 800,
        description: 'Zamonaviy smartfon',
        category: 'Elektronika',
      },
      {
        name: 'Headphones',
        price: 150,
        description: 'Shovqinni kamaytiruvchi naushniklar',
        category: 'Aksessuarlar',
      },
      {
        name: 'Coffee Maker',
        price: 100,
        description: 'Kofe tayyorlash mashinasi',
        category: 'Maishiy texnika',
      },
      {
        name: 'Backpack',
        price: 70,
        description: 'Sifatli orqa sumka',
        category: 'Aksessuarlar',
      },
      {
        name: 'Sneakers',
        price: 90,
        description: 'Quvvatli sport poyabzali',
        category: 'Kiyim',
      },
      {
        name: 'Watch',
        price: 250,
        description: 'Zamonaviy soat',
        category: 'Aksessuarlar',
      },
      {
        name: 'Electric Kettle',
        price: 40,
        description: 'Elektr choynak',
        category: 'Maishiy texnika',
      },
      {
        name: 'Tablet',
        price: 300,
        description: 'Oyin va ishlash uchun planshet',
        category: 'Elektronika',
      },
      {
        name: 'Desk Lamp',
        price: 35,
        description: 'Ish uchun stol lampasi',
        category: 'Uy uchun',
      },
      {
        name: 'Wireless Mouse',
        price: 25,
        description: 'Simsiz sichqoncha',
        category: 'Kompyuter aksessuarlari',
      },
      {
        name: 'Keyboard',
        price: 45,
        description: 'Ergonomik klaviatura',
        category: 'Kompyuter aksessuarlari',
      },
      {
        name: 'Bluetooth Speaker',
        price: 60,
        description: 'Sifatli bluetooth karnay',
        category: 'Elektronika',
      },
      {
        name: 'Camera',
        price: 500,
        description: 'Yuqori sifatli kamera',
        category: 'Elektronika',
      },
      {
        name: 'Printer',
        price: 150,
        description: 'Rangli printer',
        category: 'Ofis texnikasi',
      },
      {
        name: 'Gaming Chair',
        price: 200,
        description: 'Oyin uchun qulay stul',
        category: 'Ofis mebellari',
      },
      {
        name: 'Sunglasses',
        price: 80,
        description: 'Yozgi quyosh kozoynagi',
        category: 'Aksessuarlar',
      },
      {
        name: 'Jacket',
        price: 120,
        description: 'Qishki kiyim',
        category: 'Kiyim',
      },
      {
        name: 'Water Bottle',
        price: 15,
        description: 'Sport uchun idish',
        category: 'Aksessuarlar',
      },
      {
        name: 'Microwave',
        price: 180,
        description: 'Oshxona uchun mikrotolqinli pech',
        category: 'Maishiy texnika',
      },
    ];

    for (let product of defaultProducts) {
      const foundedProduct = await this.productModel.findOne({
        where: { name: product.name },
      });

      if (!foundedProduct) {
        await this.productModel.create(product);
      }
    }

    console.log('products created 🟢');
  }
}
