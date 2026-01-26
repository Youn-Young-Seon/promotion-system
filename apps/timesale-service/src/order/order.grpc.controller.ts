import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { TimeSaleOrder } from '../../prisma/generated/client';

type OrderWithRelations = TimeSaleOrder & {
  timeSale?: {
    id: bigint;
    discountPrice: number;
    product?: {
      id: bigint;
      name: string;
      price: number;
    } | null;
  } | null;
};

@Controller()
export class OrderGrpcController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('TimeSaleService', 'CreateOrder')
  async createOrder(data: { timeSaleId: number; userId: number; quantity: number }) {
    const order = await this.orderService.create(data) as OrderWithRelations;
    return {
      id: Number(order.id),
      timeSaleId: Number(order.timeSaleId),
      userId: String(order.userId),
      quantity: order.quantity,
      status: order.status,
      queueNumber: order.queueNumber,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      timeSale: order.timeSale
        ? {
            id: Number(order.timeSale.id),
            discountPrice: order.timeSale.discountPrice,
            product: order.timeSale.product
              ? {
                  id: Number(order.timeSale.product.id),
                  name: order.timeSale.product.name,
                  price: order.timeSale.product.price,
                }
              : undefined,
          }
        : undefined,
    };
  }

  @GrpcMethod('TimeSaleService', 'GetOrder')
  async getOrder(data: { id: number }) {
    const order = await this.orderService.findById(data.id) as OrderWithRelations;
    return {
      id: Number(order.id),
      timeSaleId: Number(order.timeSaleId),
      userId: String(order.userId),
      quantity: order.quantity,
      status: order.status,
      queueNumber: order.queueNumber,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      timeSale: order.timeSale
        ? {
            id: Number(order.timeSale.id),
            discountPrice: order.timeSale.discountPrice,
            product: order.timeSale.product
              ? {
                  id: Number(order.timeSale.product.id),
                  name: order.timeSale.product.name,
                  price: order.timeSale.product.price,
                }
              : undefined,
          }
        : undefined,
    };
  }
}
