import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('TimeSaleService', 'CreateProduct')
  async createProduct(data: { name: string; price: number; description?: string }) {
    const product = await this.productService.create(data);
    return {
      id: Number(product.id),
      name: product.name,
      price: product.price,
      description: product.description || '',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('TimeSaleService', 'GetProduct')
  async getProduct(data: { id: number }) {
    const product = await this.productService.findById(data.id);
    return {
      id: Number(product.id),
      name: product.name,
      price: product.price,
      description: product.description || '',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
