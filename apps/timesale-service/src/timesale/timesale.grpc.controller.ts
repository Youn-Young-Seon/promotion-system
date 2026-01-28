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
    productId: string | number;
    quantity: number;
    discountPrice: number;
    startAt: string;
    endAt: string;
  }) {
    const productId = typeof data.productId === 'string' ? parseInt(data.productId, 10) : data.productId;
    const timesale = await this.timesaleService.create({
      productId,
      quantity: data.quantity,
      discountPrice: data.discountPrice,
      startAt: data.startAt,
      endAt: data.endAt,
    }) as TimeSaleWithProduct;

    const timesaleResponse: Record<string, unknown> = {
      id: String(timesale.id),
      productId: String(timesale.productId),
      quantity: timesale.quantity,
      remainingQuantity: timesale.remainingQuantity,
      discountPrice: timesale.discountPrice,
      startAt: timesale.startAt.toISOString(),
      endAt: timesale.endAt.toISOString(),
      status: timesale.status,
      createdAt: timesale.createdAt.toISOString(),
    };

    if (timesale.product) {
      timesaleResponse['product'] = {
        id: String(timesale.product.id),
        name: timesale.product.name,
        price: timesale.product.price,
        description: timesale.product.description || '',
      };
    }

    return { timesale: timesaleResponse };
  }

  @GrpcMethod('TimeSaleService', 'GetTimeSale')
  async getTimeSale(data: { id: string | number }) {
    const timesaleId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
    const timesale = await this.timesaleService.findById(timesaleId) as TimeSaleWithProduct;

    const timesaleResponse: Record<string, unknown> = {
      id: String(timesale.id),
      productId: String(timesale.productId),
      quantity: timesale.quantity,
      remainingQuantity: timesale.remainingQuantity,
      discountPrice: timesale.discountPrice,
      startAt: timesale.startAt.toISOString(),
      endAt: timesale.endAt.toISOString(),
      status: timesale.status,
      createdAt: timesale.createdAt.toISOString(),
    };

    if (timesale.product) {
      timesaleResponse['product'] = {
        id: String(timesale.product.id),
        name: timesale.product.name,
        price: timesale.product.price,
        description: timesale.product.description || '',
      };
    }

    return { timesale: timesaleResponse };
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
      timesales: timeSales.map((timesale: TimeSale & { product?: { id: bigint; name: string; price: number; description: string | null } | null }) => {
        const timesaleResponse: Record<string, unknown> = {
          id: String(timesale.id),
          productId: String(timesale.productId),
          quantity: timesale.quantity,
          remainingQuantity: timesale.remainingQuantity,
          discountPrice: timesale.discountPrice,
          startAt: timesale.startAt.toISOString(),
          endAt: timesale.endAt.toISOString(),
          status: timesale.status,
          createdAt: timesale.createdAt.toISOString(),
        };

        if (timesale.product) {
          timesaleResponse['product'] = {
            id: String(timesale.product.id),
            name: timesale.product.name,
            price: timesale.product.price,
            description: timesale.product.description || '',
          };
        }

        return timesaleResponse;
      }),
      total,
      page: data.page,
      size: data.size,
    };
  }
}
