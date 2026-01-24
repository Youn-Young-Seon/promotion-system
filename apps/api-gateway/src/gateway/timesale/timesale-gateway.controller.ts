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

@Controller('products')
export class ProductController implements OnModuleInit {
  private timeSaleService: TimeSaleService;

  constructor(@Inject('TIMESALE_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.timeSaleService =
      this.client.getService<TimeSaleService>('TimeSaleService');
  }

  @Post()
  async createProduct(@Body() dto: any) {
    return await firstValueFrom(this.timeSaleService.createProduct(dto));
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await firstValueFrom(
      this.timeSaleService.getProduct({ id: parseInt(id, 10) }),
    );
  }
}

@Controller('time-sales')
export class TimeSaleController implements OnModuleInit {
  private timeSaleService: TimeSaleService;

  constructor(@Inject('TIMESALE_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.timeSaleService =
      this.client.getService<TimeSaleService>('TimeSaleService');
  }

  @Post()
  async createTimeSale(@Body() dto: any) {
    return await firstValueFrom(this.timeSaleService.createTimeSale(dto));
  }

  @Get(':id')
  async getTimeSale(@Param('id') id: string) {
    return await firstValueFrom(
      this.timeSaleService.getTimeSale({ id: parseInt(id, 10) }),
    );
  }

  @Get()
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

@Controller('orders')
export class OrderController implements OnModuleInit {
  private timeSaleService: TimeSaleService;

  constructor(@Inject('TIMESALE_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.timeSaleService =
      this.client.getService<TimeSaleService>('TimeSaleService');
  }

  @Post()
  async createOrder(@Body() dto: any) {
    return await firstValueFrom(this.timeSaleService.createOrder(dto));
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return await firstValueFrom(
      this.timeSaleService.getOrder({ id: parseInt(id, 10) }),
    );
  }
}
