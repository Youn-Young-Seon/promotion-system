import { Module } from '@nestjs/common';
import { PointController } from './point-gateway.controller';

@Module({
  controllers: [PointController],
})
export class PointGatewayModule {}
