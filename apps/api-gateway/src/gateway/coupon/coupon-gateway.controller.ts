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

interface CouponService {
  createCouponPolicy(data: any): any;
  getCouponPolicy(data: any): any;
  listCouponPolicies(data: any): any;
  issueCoupon(data: any): any;
  useCoupon(data: any): any;
  cancelCoupon(data: any): any;
  getUserCoupons(data: any): any;
}

@Controller('coupon-policies')
export class CouponPolicyController implements OnModuleInit {
  private couponService: CouponService;

  constructor(@Inject('COUPON_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.couponService = this.client.getService<CouponService>('CouponService');
  }

  @Post()
  async createCouponPolicy(@Body() dto: any) {
    return await firstValueFrom(this.couponService.createCouponPolicy(dto));
  }

  @Get(':id')
  async getCouponPolicy(@Param('id') id: string) {
    return await firstValueFrom(
      this.couponService.getCouponPolicy({ id: parseInt(id, 10) }),
    );
  }

  @Get()
  async listCouponPolicies(
    @Query('page') page = 0,
    @Query('size') size = 10,
  ) {
    return await firstValueFrom(
      this.couponService.listCouponPolicies({
        page: parseInt(String(page), 10),
        size: parseInt(String(size), 10),
      }),
    );
  }
}

@Controller('coupons')
export class CouponController implements OnModuleInit {
  private couponService: CouponService;

  constructor(@Inject('COUPON_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.couponService = this.client.getService<CouponService>('CouponService');
  }

  @Post('issue')
  async issueCoupon(@Body() dto: any) {
    return await firstValueFrom(this.couponService.issueCoupon(dto));
  }

  @Post(':id/use')
  async useCoupon(@Param('id') id: string, @Body() dto: any) {
    return await firstValueFrom(
      this.couponService.useCoupon({ id: parseInt(id, 10), ...dto }),
    );
  }

  @Post(':id/cancel')
  async cancelCoupon(@Param('id') id: string) {
    return await firstValueFrom(
      this.couponService.cancelCoupon({ id: parseInt(id, 10) }),
    );
  }

  @Get('user/:userId')
  async getUserCoupons(@Param('userId') userId: string) {
    return await firstValueFrom(
      this.couponService.getUserCoupons({ userId: parseInt(userId, 10) }),
    );
  }
}
