import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PointService } from './point.service';

@Controller()
export class PointGrpcController {
  constructor(private readonly pointService: PointService) {}

  @GrpcMethod('PointService', 'EarnPoints')
  async earnPoints(data: { userId: string | number; amount: string | number; description: string }) {
    const userId = typeof data.userId === 'string' ? parseInt(data.userId, 10) : data.userId;
    const amount = typeof data.amount === 'string' ? parseInt(data.amount, 10) : data.amount;
    const point = await this.pointService.earnPoints({ userId, amount, description: data.description });
    return {
      point: {
        id: String(point.id),
        userId: String(point.userId),
        amount: String(point.amount),
        type: point.type,
        description: point.description || '',
        balanceSnapshot: String(point.balanceSnapshot),
        createdAt: point.createdAt.toISOString(),
      },
    };
  }

  @GrpcMethod('PointService', 'UsePoints')
  async usePoints(data: { userId: string | number; amount: string | number; description: string }) {
    const userId = typeof data.userId === 'string' ? parseInt(data.userId, 10) : data.userId;
    const amount = typeof data.amount === 'string' ? parseInt(data.amount, 10) : data.amount;
    const point = await this.pointService.usePoints({ userId, amount, description: data.description });
    return {
      point: {
        id: String(point.id),
        userId: String(point.userId),
        amount: String(point.amount),
        type: point.type,
        description: point.description || '',
        balanceSnapshot: String(point.balanceSnapshot),
        createdAt: point.createdAt.toISOString(),
      },
    };
  }

  @GrpcMethod('PointService', 'CancelPoints')
  async cancelPoints(data: { transactionId: string | number; description: string }) {
    const transactionId = typeof data.transactionId === 'string' ? parseInt(data.transactionId, 10) : data.transactionId;
    const point = await this.pointService.cancelPoints({ transactionId, description: data.description });
    return {
      point: {
        id: String(point.id),
        userId: String(point.userId),
        amount: String(point.amount),
        type: point.type,
        description: point.description || '',
        balanceSnapshot: String(point.balanceSnapshot),
        createdAt: point.createdAt.toISOString(),
      },
    };
  }

  @GrpcMethod('PointService', 'GetBalance')
  async getBalance(data: { userId: string | number }) {
    const userId = typeof data.userId === 'string' ? parseInt(data.userId, 10) : data.userId;
    const balance = await this.pointService.getBalance(userId);
    return {
      userId: String(userId),
      balance: String(balance),
    };
  }

  @GrpcMethod('PointService', 'GetHistory')
  async getHistory(data: { userId: string | number; page: number; size: number }) {
    const userId = typeof data.userId === 'string' ? parseInt(data.userId, 10) : data.userId;
    const { points, total } = await this.pointService.getHistory(
      userId,
      data.page,
      data.size,
    );
    return {
      points: points.map((point) => ({
        id: String(point.id),
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
