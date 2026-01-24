import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TimesaleService } from './timesale.service';

@Controller()
export class TimesaleGrpcController {
  constructor(private readonly timesaleService: TimesaleService) {}

  @GrpcMethod('TimeSaleService', 'CreateTimeSale')
  async createTimeSale(data: {
    productId: number;
    quantity: number;
    discountPrice: number;
    startAt: string;
    endAt: string;
  }) {
    const timesale = await this.timesaleService.create({
      ...data,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
    });
    return {
      id: Number(timesale.id),
      productId: Number(timesale.productId),
      quantity: timesale.quantity,
      remainingQuantity: timesale.remainingQuantity,
      discountPrice: timesale.discountPrice,
      startAt: timesale.startAt.toISOString(),
      endAt: timesale.endAt.toISOString(),
      status: timesale.status,
      createdAt: timesale.createdAt.toISOString(),
      updatedAt: timesale.updatedAt.toISOString(),
      product: timesale.product
        ? {
            id: Number(timesale.product.id),
            name: timesale.product.name,
            price: timesale.product.price,
            description: timesale.product.description || '',
          }
        : undefined,
    };
  }

  @GrpcMethod('TimeSaleService', 'GetTimeSale')
  async getTimeSale(data: { id: number }) {
    const timesale = await this.timesaleService.findOne(data.id);
    return {
      id: Number(timesale.id),
      productId: Number(timesale.productId),
      quantity: timesale.quantity,
      remainingQuantity: timesale.remainingQuantity,
      discountPrice: timesale.discountPrice,
      startAt: timesale.startAt.toISOString(),
      endAt: timesale.endAt.toISOString(),
      status: timesale.status,
      createdAt: timesale.createdAt.toISOString(),
      updatedAt: timesale.updatedAt.toISOString(),
      product: timesale.product
        ? {
            id: Number(timesale.product.id),
            name: timesale.product.name,
            price: timesale.product.price,
            description: timesale.product.description || '',
          }
        : undefined,
    };
  }

  @GrpcMethod('TimeSaleService', 'ListTimeSales')
  async listTimeSales(data: { status?: string; page: number; size: number }) {
    const { timesales, total } = await this.timesaleService.findAll(
      data.status,
      data.page,
      data.size,
    );
    return {
      timesales: timesales.map((timesale) => ({
        id: Number(timesale.id),
        productId: Number(timesale.productId),
        quantity: timesale.quantity,
        remainingQuantity: timesale.remainingQuantity,
        discountPrice: timesale.discountPrice,
        startAt: timesale.startAt.toISOString(),
        endAt: timesale.endAt.toISOString(),
        status: timesale.status,
        createdAt: timesale.createdAt.toISOString(),
        updatedAt: timesale.updatedAt.toISOString(),
        product: timesale.product
          ? {
              id: Number(timesale.product.id),
              name: timesale.product.name,
              price: timesale.product.price,
              description: timesale.product.description || '',
            }
          : undefined,
      })),
      total,
      page: data.page,
      size: data.size,
    };
  }
}
