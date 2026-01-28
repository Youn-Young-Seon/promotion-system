import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { DynamicGrpcClientService } from '../../common/dynamic-grpc-client.service';
import { EarnPointsDto } from './dto/earn-points.dto';
import { UsePointsDto } from './dto/use-points.dto';
import { CancelPointsDto } from './dto/cancel-points.dto';

interface PointService {
  earnPoints(data: unknown): Observable<unknown>;
  usePoints(data: unknown): Observable<unknown>;
  cancelPoints(data: unknown): Observable<unknown>;
  getBalance(data: { userId: number }): Observable<unknown>;
  getHistory(data: { userId: number; page: number; size: number }): Observable<unknown>;
}

@ApiTags('Point')
@ApiBearerAuth('access-token')
@Controller('points')
export class PointController {
  constructor(private readonly dynamicGrpcClient: DynamicGrpcClientService) {}

  private getPointService(): PointService {
    const client = this.dynamicGrpcClient.getPointClient();
    return client.getService<PointService>('PointService');
  }

  @Post('earn')
  @ApiOperation({ summary: '적립금 적립', description: '사용자에게 적립금을 적립합니다.' })
  @ApiResponse({ status: 201, description: '적립금이 성공적으로 적립되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터입니다.' })
  async earnPoints(@Body() dto: EarnPointsDto) {
    // NestJS gRPC uses camelCase
    const grpcRequest = {
      userId: dto.userId,
      amount: dto.amount,
      description: dto.description,
    };
    return await firstValueFrom(this.getPointService().earnPoints(grpcRequest));
  }

  @Post('use')
  @ApiOperation({ summary: '적립금 사용', description: '사용자의 적립금을 사용합니다.' })
  @ApiResponse({ status: 200, description: '적립금이 성공적으로 사용되었습니다.' })
  @ApiResponse({ status: 400, description: '잔액이 부족하거나 잘못된 요청입니다.' })
  async usePoints(@Body() dto: UsePointsDto) {
    // NestJS gRPC uses camelCase
    const grpcRequest = {
      userId: dto.userId,
      amount: dto.amount,
      description: dto.description,
    };
    return await firstValueFrom(this.getPointService().usePoints(grpcRequest));
  }

  @Post('cancel')
  @ApiOperation({ summary: '적립금 취소', description: '사용된 적립금을 취소합니다.' })
  @ApiResponse({ status: 200, description: '적립금이 성공적으로 취소되었습니다.' })
  @ApiResponse({ status: 400, description: '취소할 수 없는 거래입니다.' })
  async cancelPoints(@Body() dto: CancelPointsDto) {
    // NestJS gRPC uses camelCase
    const grpcRequest = {
      transactionId: dto.transactionId,
      description: dto.description,
    };
    return await firstValueFrom(this.getPointService().cancelPoints(grpcRequest));
  }

  @Get('users/:userId/balance')
  @ApiOperation({ summary: '적립금 잔액 조회', description: '특정 사용자의 적립금 잔액을 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '잔액 조회 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  async getBalance(@Param('userId') userId: string) {
    return await firstValueFrom(
      this.getPointService().getBalance({ userId: parseInt(userId, 10) }),
    );
  }

  @Get('users/:userId/history')
  @ApiOperation({ summary: '적립금 거래 내역 조회', description: '특정 사용자의 적립금 거래 내역을 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', type: 'number' })
  @ApiQuery({ name: 'page', required: false, type: 'number', description: '페이지 번호 (기본값: 0)' })
  @ApiQuery({ name: 'size', required: false, type: 'number', description: '페이지 크기 (기본값: 10)' })
  @ApiResponse({ status: 200, description: '거래 내역 조회 성공' })
  async getHistory(
    @Param('userId') userId: string,
    @Query('page') page = 0,
    @Query('size') size = 10,
  ) {
    return await firstValueFrom(
      this.getPointService().getHistory({
        userId: parseInt(userId, 10),
        page: parseInt(String(page), 10),
        size: parseInt(String(size), 10),
      }),
    );
  }
}
