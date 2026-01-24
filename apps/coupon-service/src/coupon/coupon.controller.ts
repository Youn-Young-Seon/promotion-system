import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { IssueCouponDto, UseCouponDto } from './dto';

@Controller('api/v1/coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('issue')
  async issueCoupon(@Body() dto: IssueCouponDto) {
    return this.couponService.issueCoupon(dto);
  }

  @Post(':id/use')
  async useCoupon(@Param('id', ParseIntPipe) id: number, @Body() dto: UseCouponDto) {
    return this.couponService.useCoupon(id, dto);
  }

  @Post(':id/cancel')
  async cancelCoupon(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.cancelCoupon(id);
  }

  @Get('user/:userId')
  async getUserCoupons(@Param('userId', ParseIntPipe) userId: number) {
    return this.couponService.getUserCoupons(userId);
  }
}
