import { Module } from '@nestjs/common';
import {
  ProductController,
  TimeSaleController,
  OrderController,
} from './timesale-gateway.controller';

@Module({
  controllers: [ProductController, TimeSaleController, OrderController],
})
export class TimeSaleGatewayModule {}
