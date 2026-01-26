import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TimeSaleService } from './timesale.service';
import { TimeSale, TimeSaleStatus } from '../../prisma/generated/client';

type TimeSaleWithProduct = TimeSale & {
  product?: {
    id: bigint;
    name: string;
    price: number;
    description: string;
  } | null;
};

@Controller()
export class TimesaleGrpcController {
  constructor(private readonly timesaleService: TimeSaleService) {}

  @GrpcMethod('TimeSaleService', 'CreateTimeSale')
  async createTimeSale(data: {
    productId: number;
    quantity: number;
    discountPrice: number;
    startAt: string;
    endAt: string;
  }) {
    const timesale = await this.timesaleService.create({
      productId: data.productId,
      quantity: data.quantity,
      discountPrice: data.discountPrice,
      startAt: data.startAt,
      endAt: data.endAt,
    }) as TimeSaleWithProduct;
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
    const timesale = await this.timesaleService.findById(data.id) as TimeSaleWithProduct;
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
    const statusEnum = data.status ? (data.status as TimeSaleStatus) : undefined;
    const { timeSales, total } = await this.timesaleService.findAll(
      data.page,
      data.size,
      statusEnum,
    );
    return {
      timesales: timeSales.map((timesale: TimeSale & { product?: { id: bigint; name: string; price: number; description: string | null } | null }) => ({
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
