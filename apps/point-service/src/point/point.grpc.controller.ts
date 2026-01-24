import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PointService } from './point.service';

@Controller()
export class PointGrpcController {
  constructor(private readonly pointService: PointService) {}

  @GrpcMethod('PointService', 'EarnPoints')
  async earnPoints(data: { userId: number; amount: number; description: string }) {
    const point = await this.pointService.earnPoints(data);
    return {
      id: Number(point.id),
      userId: String(point.userId),
      amount: String(point.amount),
      type: point.type,
      description: point.description || '',
      balanceSnapshot: String(point.balanceSnapshot),
      createdAt: point.createdAt.toISOString(),
    };
  }

  @GrpcMethod('PointService', 'UsePoints')
  async usePoints(data: { userId: number; amount: number; description: string }) {
    const point = await this.pointService.usePoints(data);
    return {
      id: Number(point.id),
      userId: String(point.userId),
      amount: String(point.amount),
      type: point.type,
      description: point.description || '',
      balanceSnapshot: String(point.balanceSnapshot),
      createdAt: point.createdAt.toISOString(),
    };
  }

  @GrpcMethod('PointService', 'CancelPoints')
  async cancelPoints(data: { transactionId: number; description: string }) {
    const point = await this.pointService.cancelPoints(data);
    return {
      id: Number(point.id),
      userId: String(point.userId),
      amount: String(point.amount),
      type: point.type,
      description: point.description || '',
      balanceSnapshot: String(point.balanceSnapshot),
      createdAt: point.createdAt.toISOString(),
    };
  }

  @GrpcMethod('PointService', 'GetBalance')
  async getBalance(data: { userId: number }) {
    const balance = await this.pointService.getBalance(data.userId);
    return {
      userId: data.userId,
      balance,
    };
  }

  @GrpcMethod('PointService', 'GetHistory')
  async getHistory(data: { userId: number; page: number; size: number }) {
    const { points, total } = await this.pointService.getHistory(
      data.userId,
      data.page,
      data.size,
    );
    return {
      points: points.map((point) => ({
        id: Number(point.id),
        userId: String(point.userId),
        amount: String(point.amount),
        type: point.type,
        description: point.description || '',
        balanceSnapshot: String(point.balanceSnapshot),
        createdAt: point.createdAt.toISOString(),
      })),
      total,
      page: data.page,
      size: data.size,
    };
  }
}
