import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '@modules';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { CheckAuthGuard, CheckRolesGuard } from '@guards';
import { JwtHelper } from '@helpers';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      sync: {
        alter: true,
        // force: true,
      },
      autoLoadModels: true,
    }),
    UserModule,
    ProductModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CheckRolesGuard,
    },
    JwtHelper,
    JwtService,
  ],
})
export class AppModule {}
