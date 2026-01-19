import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PointService } from './point.service';

interface GetBalanceRequest {
    userId: string;
}

interface GetHistoryRequest {
    userId: string;
    page: number;
    limit: number;
}

interface AddPointRequest {
    userId: string;
    amount: string;
    description: string;
}

interface UsePointRequest {
    userId: string;
    amount: string;
    description: string;
}

@Controller()
export class PointGrpcController {
    constructor(private readonly pointService: PointService) { }

    @GrpcMethod('PointService', 'GetBalance')
    async getBalance(data: GetBalanceRequest) {
        const result = await this.pointService.getBalance(BigInt(data.userId));

        return {
            userId: result.userId,
            balance: result.balance,
            version: '0',
        };
    }

    @GrpcMethod('PointService', 'GetHistory')
    async getHistory(data: GetHistoryRequest) {
        const result = await this.pointService.getHistory(
            BigInt(data.userId),
            data.page || 1,
            data.limit || 20
        );

        return {
            items: result.points.map(item => ({
                id: item.id,
                userId: data.userId,
                amount: item.amount,
                type: item.type,
                description: item.description,
                balanceSnapshot: item.balanceSnapshot,
                createdAt: item.createdAt.toISOString(),
            })),
            total: result.pagination.total,
            page: result.pagination.page,
            limit: result.pagination.limit,
        };
    }

    @GrpcMethod('PointService', 'AddPoint')
    async addPoint(data: AddPointRequest) {
        const dto = {
            userId: data.userId,
            amount: parseInt(data.amount),
            description: data.description,
        };

        const result = await this.pointService.addPoint(dto);

        return {
            success: true,
            balance: result.balanceSnapshot,
            message: 'Points added successfully',
        };
    }

    @GrpcMethod('PointService', 'UsePoint')
    async usePoint(data: UsePointRequest) {
        const dto = {
            userId: data.userId,
            amount: parseInt(data.amount),
            description: data.description,
        };

        const result = await this.pointService.usePoint(dto);

        return {
            success: true,
            balance: result.balanceSnapshot,
            message: 'Points used successfully',
        };
    }
}
