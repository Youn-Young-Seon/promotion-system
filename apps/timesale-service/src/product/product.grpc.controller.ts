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
      product: {
        id: String(product.id),
        name: product.name,
        price: product.price,
        description: product.description || '',
        createdAt: product.createdAt.toISOString(),
      },
    };
  }

  @GrpcMethod('TimeSaleService', 'GetProduct')
  async getProduct(data: { id: string | number }) {
    const productId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
    const product = await this.productService.findById(productId);
    return {
      product: {
        id: String(product.id),
        name: product.name,
        price: product.price,
        description: product.description || '',
        createdAt: product.createdAt.toISOString(),
      },
    };
  }
}
