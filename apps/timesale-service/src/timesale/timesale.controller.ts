import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TimeSaleService } from './timesale.service';
import { CreateTimeSaleDto } from './dto';
import { TimeSaleStatus } from '../../prisma/generated/client';

@Controller('api/v1/time-sales')
export class TimeSaleController {
  constructor(private readonly timeSaleService: TimeSaleService) {}

  @Post()
  async create(@Body() dto: CreateTimeSaleDto) {
    return this.timeSaleService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.timeSaleService.findById(id);
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page = 0,
    @Query('size', ParseIntPipe) size = 10,
    @Query('status') status?: TimeSaleStatus,
  ) {
    return this.timeSaleService.findAll(page, size, status);
  }
}
