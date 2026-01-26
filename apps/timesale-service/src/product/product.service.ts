import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../../prisma/generated/client';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<Product> {
    this.logger.log(`Creating product: ${dto.name}`);

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        description: dto.description ?? '',
      },
    });

    this.logger.log(`Product created: ${product.id}`);
    return product;
  }

  async findById(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id: BigInt(id) },
      include: {
        timeSales: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
