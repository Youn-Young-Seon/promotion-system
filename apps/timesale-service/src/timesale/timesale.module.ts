import { Module } from '@nestjs/common';
import { TimeSaleController } from './timesale.controller';
import { TimeSaleGrpcController } from './timesale.grpc.controller';
import { TimeSaleService } from './timesale.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderV1Strategy, OrderV2Strategy, OrderV3Strategy } from './strategies';

@Module({
    controllers: [TimeSaleController, TimeSaleGrpcController],
    providers: [
        TimeSaleService,
        PrismaService,
        // Strategy Pattern: Register all order strategies
        OrderV1Strategy,
        OrderV2Strategy,
        OrderV3Strategy,
    ],
})
export class TimeSaleModule { }
