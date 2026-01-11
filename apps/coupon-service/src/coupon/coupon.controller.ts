import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponPolicyDto, IssueCouponDto, UseCouponDto } from './dto';

@ApiTags('coupons')
@Controller('coupons')
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @Post('policies')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '쿠폰 정책 생성', description: '새로운 쿠폰 정책을 생성합니다' })
    @ApiResponse({ status: 201, description: '쿠폰 정책이 성공적으로 생성되었습니다' })
    @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
    async createPolicy(@Body() dto: CreateCouponPolicyDto) {
        return this.couponService.createPolicy(dto);
    }

    @Post('issue')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '쿠폰 발급', description: '사용자에게 쿠폰을 발급합니다' })
    @ApiQuery({ name: 'strategy', enum: ['v1', 'v2'], required: false, description: 'v1: DB 기반, v2: Redis 분산 락' })
    @ApiResponse({ status: 201, description: '쿠폰이 성공적으로 발급되었습니다' })
    @ApiResponse({ status: 400, description: '쿠폰 소진 또는 중복 발급' })
    @ApiResponse({ status: 404, description: '쿠폰 정책을 찾을 수 없습니다' })
    async issueCoupon(
        @Body() dto: IssueCouponDto,
        @Query('strategy') strategy: string = 'v1',
    ) {
        return this.couponService.issueCoupon(dto, strategy);
    }

    @Post('use')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '쿠폰 사용', description: '주문 시 쿠폰을 사용합니다' })
    @ApiResponse({ status: 200, description: '쿠폰이 성공적으로 사용되었습니다' })
    @ApiResponse({ status: 400, description: '사용 불가능한 쿠폰' })
    @ApiResponse({ status: 404, description: '쿠폰을 찾을 수 없습니다' })
    async useCoupon(@Body() dto: UseCouponDto) {
        return this.couponService.useCoupon(BigInt(dto.couponId), BigInt(dto.orderId));
    }

    @Get('user/:userId')
    @ApiOperation({ summary: '사용자 쿠폰 조회', description: '사용자가 보유한 쿠폰 목록을 조회합니다' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiResponse({ status: 200, description: '쿠폰 목록 조회 성공' })
    async getUserCoupons(@Param('userId') userId: string) {
        return this.couponService.getUserCoupons(BigInt(userId));
    }
}
