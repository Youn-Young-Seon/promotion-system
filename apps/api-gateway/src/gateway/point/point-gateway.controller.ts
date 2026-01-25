import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

interface PointService {
  earnPoints(data: any): any;
  usePoints(data: any): any;
  cancelPoints(data: any): any;
  getBalance(data: any): any;
  getHistory(data: any): any;
}

@ApiTags('Point')
@Controller('points')
export class PointController implements OnModuleInit {
  private pointService: PointService;

  constructor(@Inject('POINT_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.pointService = this.client.getService<PointService>('PointService');
  }

  @Post('earn')
  @ApiOperation({ summary: '적립금 적립', description: '사용자에게 적립금을 적립합니다.' })
  @ApiResponse({ status: 201, description: '적립금이 성공적으로 적립되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터입니다.' })
  async earnPoints(@Body() dto: any) {
    return await firstValueFrom(this.pointService.earnPoints(dto));
  }

  @Post('use')
  @ApiOperation({ summary: '적립금 사용', description: '사용자의 적립금을 사용합니다.' })
  @ApiResponse({ status: 200, description: '적립금이 성공적으로 사용되었습니다.' })
  @ApiResponse({ status: 400, description: '잔액이 부족하거나 잘못된 요청입니다.' })
  async usePoints(@Body() dto: any) {
    return await firstValueFrom(this.pointService.usePoints(dto));
  }

  @Post('cancel')
  @ApiOperation({ summary: '적립금 취소', description: '사용된 적립금을 취소합니다.' })
  @ApiResponse({ status: 200, description: '적립금이 성공적으로 취소되었습니다.' })
  @ApiResponse({ status: 400, description: '취소할 수 없는 거래입니다.' })
  async cancelPoints(@Body() dto: any) {
    return await firstValueFrom(this.pointService.cancelPoints(dto));
  }

  @Get('users/:userId/balance')
  @ApiOperation({ summary: '적립금 잔액 조회', description: '특정 사용자의 적립금 잔액을 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '잔액 조회 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  async getBalance(@Param('userId') userId: string) {
    return await firstValueFrom(
      this.pointService.getBalance({ userId: parseInt(userId, 10) }),
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
      this.pointService.getHistory({
        userId: parseInt(userId, 10),
        page: parseInt(String(page), 10),
        size: parseInt(String(size), 10),
      }),
    );
  }
}
