import { Module } from '@nestjs/common';
import { TimeSaleController } from './timesale.controller';
import { TimeSaleService } from './timesale.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [TimeSaleController],
    providers: [TimeSaleService, PrismaService],
})
export class TimeSaleModule { }
