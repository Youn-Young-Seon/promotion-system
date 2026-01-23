import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';

@ApiTags('gateway')
@Controller()
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) { }

    // ==================== Coupon Service ====================

    @Post('coupons/policies')
    @ApiOperation({ summary: '쿠폰 정책 생성' })
    async createCouponPolicy(@Body() body: any) {
        return this.gatewayService.callCouponService('createPolicy', body);
    }

    @Post('coupons/issue')
    @ApiOperation({ summary: '쿠폰 발급' })
    async issueCoupon(@Body() body: any, @Query('strategy') strategy?: string) {
        return this.gatewayService.callCouponService('issueCoupon', {
            userId: body.userId,
            couponPolicyId: body.policyId,
            strategy: strategy || 'v1',
        });
    }

    @Post('coupons/:couponId/use')
    @ApiOperation({ summary: '쿠폰 사용' })
    async useCoupon(@Param('couponId') couponId: string, @Body() body: any) {
        return this.gatewayService.callCouponService('useCoupon', {
            couponId,
            orderId: body.orderId,
        });
    }

    @Get('coupons/users/:userId')
    @ApiOperation({ summary: '사용자 쿠폰 조회' })
    async getUserCoupons(@Param('userId') userId: string) {
        return this.gatewayService.callCouponService('getUserCoupons', { userId });
    }

    // ==================== Point Service ====================

    @Get('points/balance/:userId')
    @ApiOperation({ summary: '적립금 잔액 조회' })
    async getPointBalance(@Param('userId') userId: string) {
        return this.gatewayService.callPointService('getBalance', { userId });
    }

    @Get('points/history/:userId')
    @ApiOperation({ summary: '적립금 내역 조회' })
    async getPointHistory(
        @Param('userId') userId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.gatewayService.callPointService('getHistory', {
            userId,
            page: page || 1,
            limit: limit || 20,
        });
    }

    @Post('points/add')
    @ApiOperation({ summary: '적립금 적립' })
    async addPoint(@Body() body: any) {
        return this.gatewayService.callPointService('addPoint', {
            userId: body.userId,
            amount: body.amount.toString(),
            description: body.description,
        });
    }

    @Post('points/use')
    @ApiOperation({ summary: '적립금 사용' })
    async usePoint(@Body() body: any) {
        return this.gatewayService.callPointService('usePoint', {
            userId: body.userId,
            amount: body.amount.toString(),
            description: body.description,
        });
    }

    // ==================== TimeSale Service ====================

    @Post('timesales')
    @ApiOperation({ summary: '타임세일 생성' })
    async createTimeSale(@Body() body: any) {
        return this.gatewayService.callTimeSaleService('createTimeSale', {
            productId: body.productId,
            quantity: body.quantity.toString(),
            discountPrice: body.discountPrice.toString(),
            startAt: body.startAt,
            endAt: body.endAt,
        });
    }

    @Post('timesales/:timeSaleId/orders')
    @ApiOperation({ summary: '타임세일 주문 생성' })
    async createTimeSaleOrder(
        @Param('timeSaleId') timeSaleId: string,
        @Body() body: any,
        @Query('strategy') strategy?: string,
    ) {
        return this.gatewayService.callTimeSaleService('createOrder', {
            timeSaleId,
            userId: body.userId,
            quantity: body.quantity.toString(),
            strategy: strategy || 'v1',
        });
    }

    @Get('timesales/:id')
    @ApiOperation({ summary: '타임세일 조회' })
    async getTimeSale(@Param('id') id: string) {
        return this.gatewayService.callTimeSaleService('getTimeSale', { id });
    }
}
