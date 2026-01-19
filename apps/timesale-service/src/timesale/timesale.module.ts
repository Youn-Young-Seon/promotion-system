import { Module } from '@nestjs/common';
import { TimeSaleController } from './timesale.controller';
import { TimeSaleGrpcController } from './timesale.grpc.controller';
import { TimeSaleService } from './timesale.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [TimeSaleController, TimeSaleGrpcController],
    providers: [TimeSaleService, PrismaService],
})
export class TimeSaleModule { }
