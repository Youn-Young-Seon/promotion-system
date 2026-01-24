import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductGrpcController } from './product.grpc.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProductController, ProductGrpcController],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}
