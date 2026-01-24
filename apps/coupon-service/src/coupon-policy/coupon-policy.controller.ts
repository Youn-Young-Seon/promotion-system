import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CouponPolicyService } from './coupon-policy.service';
import { CreateCouponPolicyDto } from './dto';

@Controller('api/v1/coupon-policies')
export class CouponPolicyController {
  constructor(private readonly couponPolicyService: CouponPolicyService) {}

  @Post()
  async create(@Body() dto: CreateCouponPolicyDto) {
    return this.couponPolicyService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.couponPolicyService.findById(id);
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page = 0,
    @Query('size', ParseIntPipe) size = 10,
  ) {
    return this.couponPolicyService.findAll(page, size);
  }
}
