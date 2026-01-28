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
  async createOrder(data: { timeSaleId: string | number; userId: string | number; quantity: number }) {
    const timeSaleId = typeof data.timeSaleId === 'string' ? parseInt(data.timeSaleId, 10) : data.timeSaleId;
    const userId = typeof data.userId === 'string' ? parseInt(data.userId, 10) : data.userId;
    const order = await this.orderService.create({ timeSaleId, userId, quantity: data.quantity }) as OrderWithRelations;
    return {
      order: {
        id: String(order.id),
        timeSaleId: String(order.timeSaleId),
        userId: String(order.userId),
        quantity: order.quantity,
        status: order.status,
        queueNumber: order.queueNumber,
        createdAt: order.createdAt.toISOString(),
      },
    };
  }

  @GrpcMethod('TimeSaleService', 'GetOrder')
  async getOrder(data: { id: string | number }) {
    const orderId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
    const order = await this.orderService.findById(orderId) as OrderWithRelations;
    return {
      order: {
        id: String(order.id),
        timeSaleId: String(order.timeSaleId),
        userId: String(order.userId),
        quantity: order.quantity,
        status: order.status,
        queueNumber: order.queueNumber,
        createdAt: order.createdAt.toISOString(),
      },
    };
  }
}
