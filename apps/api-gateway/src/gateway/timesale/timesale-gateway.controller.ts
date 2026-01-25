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

interface TimeSaleService {
  createProduct(data: any): any;
  getProduct(data: any): any;
  createTimeSale(data: any): any;
  getTimeSale(data: any): any;
  listTimeSales(data: any): any;
  createOrder(data: any): any;
  getOrder(data: any): any;
}

@ApiTags('TimeSale')
@Controller('products')
export class ProductController implements OnModuleInit {
  private timeSaleService: TimeSaleService;

  constructor(@Inject('TIMESALE_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.timeSaleService =
      this.client.getService<TimeSaleService>('TimeSaleService');
  }

  @Post()
  @ApiOperation({ summary: '상품 등록', description: '새로운 상품을 등록합니다.' })
  @ApiResponse({ status: 201, description: '상품이 성공적으로 등록되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터입니다.' })
  async createProduct(@Body() dto: any) {
    return await firstValueFrom(this.timeSaleService.createProduct(dto));
  }

  @Get(':id')
  @ApiOperation({ summary: '상품 조회', description: 'ID로 특정 상품을 조회합니다.' })
  @ApiParam({ name: 'id', description: '상품 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '상품 조회 성공' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없습니다.' })
  async getProduct(@Param('id') id: string) {
    return await firstValueFrom(
      this.timeSaleService.getProduct({ id: parseInt(id, 10) }),
    );
  }
}

@ApiTags('TimeSale')
@Controller('time-sales')
export class TimeSaleController implements OnModuleInit {
  private timeSaleService: TimeSaleService;

  constructor(@Inject('TIMESALE_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.timeSaleService =
      this.client.getService<TimeSaleService>('TimeSaleService');
  }

  @Post()
  @ApiOperation({ summary: '타임세일 생성', description: '새로운 타임세일을 생성합니다.' })
  @ApiResponse({ status: 201, description: '타임세일이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터입니다.' })
  async createTimeSale(@Body() dto: any) {
    return await firstValueFrom(this.timeSaleService.createTimeSale(dto));
  }

  @Get(':id')
  @ApiOperation({ summary: '타임세일 조회', description: 'ID로 특정 타임세일을 조회합니다.' })
  @ApiParam({ name: 'id', description: '타임세일 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '타임세일 조회 성공' })
  @ApiResponse({ status: 404, description: '타임세일을 찾을 수 없습니다.' })
  async getTimeSale(@Param('id') id: string) {
    return await firstValueFrom(
      this.timeSaleService.getTimeSale({ id: parseInt(id, 10) }),
    );
  }

  @Get()
  @ApiOperation({ summary: '타임세일 목록 조회', description: '타임세일 목록을 조회합니다.' })
  @ApiQuery({ name: 'status', required: false, type: 'string', description: '상태 필터 (SCHEDULED, ACTIVE, ENDED, SOLD_OUT)' })
  @ApiQuery({ name: 'page', required: false, type: 'number', description: '페이지 번호 (기본값: 0)' })
  @ApiQuery({ name: 'size', required: false, type: 'number', description: '페이지 크기 (기본값: 10)' })
  @ApiResponse({ status: 200, description: '타임세일 목록 조회 성공' })
  async listTimeSales(
    @Query('status') status?: string,
    @Query('page') page = 0,
    @Query('size') size = 10,
  ) {
    return await firstValueFrom(
      this.timeSaleService.listTimeSales({
        status,
        page: parseInt(String(page), 10),
        size: parseInt(String(size), 10),
      }),
    );
  }
}

@ApiTags('TimeSale')
@Controller('orders')
export class OrderController implements OnModuleInit {
  private timeSaleService: TimeSaleService;

  constructor(@Inject('TIMESALE_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.timeSaleService =
      this.client.getService<TimeSaleService>('TimeSaleService');
  }

  @Post()
  @ApiOperation({ summary: '주문 생성', description: '타임세일 상품을 주문합니다.' })
  @ApiResponse({ status: 201, description: '주문이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '재고가 부족하거나 잘못된 요청입니다.' })
  async createOrder(@Body() dto: any) {
    return await firstValueFrom(this.timeSaleService.createOrder(dto));
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 조회', description: 'ID로 특정 주문을 조회합니다.' })
  @ApiParam({ name: 'id', description: '주문 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '주문 조회 성공' })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없습니다.' })
  async getOrder(@Param('id') id: string) {
    return await firstValueFrom(
      this.timeSaleService.getOrder({ id: parseInt(id, 10) }),
    );
  }
}
