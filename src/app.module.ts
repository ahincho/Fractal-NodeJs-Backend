import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'config/app/app.config.module';
import { DatabaseConfigModule } from 'config/database/database.module';
import { TypeOrmConfigModule } from 'config/orm/type.orm.config.module';
import { TypeOrmConfigService } from 'config/orm/type.orm.config.service';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductEntity } from './entities/product.entity';
import { APP_FILTER } from '@nestjs/core';
import { ProductHttpExceptionFilter } from './filters/product.http.exception.filter';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { DetailEntity } from './entities/detail.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderHttpExceptionFilter } from './filters/order.http.exception.filter';
import { CategoryEntity } from './entities/category.entity';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { CategoryHttpExceptionFilter } from './filters/category.http.exception.filter';
import { DetailService } from './services/detail.service';

@Module({
  imports: [
    AppConfigModule,
    DatabaseConfigModule,
    TypeOrmModule.forRootAsync({
      useExisting: TypeOrmConfigService,
      imports: [TypeOrmConfigModule],
    }),
    TypeOrmModule.forFeature([
      CategoryEntity,
      ProductEntity,
      DetailEntity,
      OrderEntity,
    ]),
  ],
  controllers: [CategoryController, ProductController, OrderController],
  providers: [
    CategoryService,
    ProductService,
    OrderService,
    DetailService,
    {
      provide: APP_FILTER,
      useClass: CategoryHttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ProductHttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: OrderHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
