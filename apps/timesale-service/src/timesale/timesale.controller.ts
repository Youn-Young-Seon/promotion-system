import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TimeSaleService } from './timesale.service';
import { CreateTimeSaleDto, CreateOrderDto } from './dto';

@ApiTags('timesales')
@Controller('timesales')
export class TimeSaleController {
    constructor(private readonly timeSaleService: TimeSaleService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '타임세일 등록', description: '새로운 타임세일을 등록합니다' })
    @ApiResponse({ status: 201, description: '타임세일이 성공적으로 등록되었습니다' })
    @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
    @ApiResponse({ status: 404, description: '상품을 찾을 수 없습니다' })
    async createTimeSale(@Body() dto: CreateTimeSaleDto) {
        return this.timeSaleService.createTimeSale(dto);
    }

    @Post(':id/orders')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '타임세일 주문', description: '타임세일 상품을 주문합니다' })
    @ApiParam({ name: 'id', description: '타임세일 ID' })
    @ApiQuery({ name: 'strategy', enum: ['v1', 'v2'], required: false, description: 'v1: DB 기반, v2: Redis 재고 관리' })
    @ApiResponse({ status: 201, description: '주문이 성공적으로 생성되었습니다' })
    @ApiResponse({ status: 400, description: '재고 부족 또는 판매 시간 아님' })
    @ApiResponse({ status: 404, description: '타임세일을 찾을 수 없습니다' })
    async createOrder(
        @Param('id') timeSaleId: string,
        @Body() dto: CreateOrderDto,
        @Query('strategy') strategy: string = 'v1',
    ) {
        return this.timeSaleService.createOrder(BigInt(timeSaleId), dto, strategy);
    }

    @Get(':id')
    @ApiOperation({ summary: '타임세일 조회', description: '타임세일 상세 정보를 조회합니다' })
    @ApiParam({ name: 'id', description: '타임세일 ID' })
    @ApiResponse({ status: 200, description: '조회 성공' })
    @ApiResponse({ status: 404, description: '타임세일을 찾을 수 없습니다' })
    async getTimeSale(@Param('id') id: string) {
        return this.timeSaleService.getTimeSale(BigInt(id));
    }
}
