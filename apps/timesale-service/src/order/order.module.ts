import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderGrpcController } from './order.grpc.controller';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OrderController, OrderGrpcController],
  providers: [OrderService, PrismaService],
  exports: [OrderService],
})
export class OrderModule {}
