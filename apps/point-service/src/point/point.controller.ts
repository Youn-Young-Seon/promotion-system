import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PointService } from './point.service';
import { AddPointDto, UsePointDto } from './dto';

@ApiTags('points')
@Controller('points')
export class PointController {
    constructor(private readonly pointService: PointService) { }

    @Get(':userId')
    @ApiOperation({ summary: '적립금 잔액 조회', description: '사용자의 적립금 잔액을 조회합니다 (Redis 캐싱)' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiResponse({ status: 200, description: '잔액 조회 성공' })
    async getBalance(@Param('userId') userId: string) {
        return this.pointService.getBalance(BigInt(userId));
    }

    @Get(':userId/history')
    @ApiOperation({ summary: '적립금 내역 조회', description: '적립/사용 내역을 페이지네이션으로 조회합니다' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiQuery({ name: 'page', required: false, description: '페이지 번호 (기본: 1)' })
    @ApiQuery({ name: 'limit', required: false, description: '페이지 크기 (기본: 20)' })
    @ApiResponse({ status: 200, description: '내역 조회 성공' })
    async getHistory(
        @Param('userId') userId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
    ) {
        return this.pointService.getHistory(
            BigInt(userId),
            parseInt(page),
            parseInt(limit),
        );
    }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '적립금 적립', description: '사용자에게 적립금을 지급합니다' })
    @ApiResponse({ status: 201, description: '적립 성공' })
    @ApiResponse({ status: 400, description: '동시성 충돌' })
    async addPoint(@Body() dto: AddPointDto) {
        return this.pointService.addPoint(dto);
    }

    @Post('use')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '적립금 사용', description: '주문 시 적립금을 사용합니다' })
    @ApiResponse({ status: 201, description: '사용 성공' })
    @ApiResponse({ status: 400, description: '잔액 부족 또는 동시성 충돌' })
    @ApiResponse({ status: 404, description: '적립금 정보를 찾을 수 없습니다' })
    async usePoint(@Body() dto: UsePointDto) {
        return this.pointService.usePoint(dto);
    }
}
