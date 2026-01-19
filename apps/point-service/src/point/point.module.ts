import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { PointGrpcController } from './point.grpc.controller';
import { PointService } from './point.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [PointController, PointGrpcController],
    providers: [PointService, PrismaService],
})
export class PointModule { }
