import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  OnModuleInit,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { DynamicGrpcClientService } from '../../common/dynamic-grpc-client.service';

interface CouponPolicyRequest {
  title: string;
  description: string;
  totalQuantity: number;
  startTime: string;
  endTime: string;
  discountType: string;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
}

interface IssueCouponRequest {
  userId: number;
  policyId: number;
}

interface UseCouponRequest {
  orderAmount: number;
}

interface CouponService {
  createCouponPolicy(data: CouponPolicyRequest): Observable<unknown>;
  getCouponPolicy(data: { id: number }): Observable<unknown>;
  listCouponPolicies(data: { page: number; size: number }): Observable<unknown>;
  issueCoupon(data: IssueCouponRequest): Observable<unknown>;
  useCoupon(data: { id: number } & UseCouponRequest): Observable<unknown>;
  cancelCoupon(data: { id: number }): Observable<unknown>;
  getUserCoupons(data: { userId: number }): Observable<unknown>;
}

@ApiTags('Coupon')
@Controller('coupon-policies')
export class CouponPolicyController implements OnModuleInit {
  private couponService: CouponService;

  constructor(private readonly dynamicGrpcClient: DynamicGrpcClientService) {}

  onModuleInit() {
    const client = this.dynamicGrpcClient.getCouponClient();
    this.couponService = client.getService<CouponService>('CouponService');
  }

  @Post()
  @ApiOperation({ summary: '쿠폰 정책 생성', description: '새로운 쿠폰 정책을 생성합니다.' })
  @ApiResponse({ status: 201, description: '쿠폰 정책이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터입니다.' })
  async createCouponPolicy(@Body() dto: CouponPolicyRequest) {
    return await firstValueFrom(this.couponService.createCouponPolicy(dto));
  }

  @Get(':id')
  @ApiOperation({ summary: '쿠폰 정책 조회', description: 'ID로 특정 쿠폰 정책을 조회합니다.' })
  @ApiParam({ name: 'id', description: '쿠폰 정책 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '쿠폰 정책 조회 성공' })
  @ApiResponse({ status: 404, description: '쿠폰 정책을 찾을 수 없습니다.' })
  async getCouponPolicy(@Param('id') id: string) {
    return await firstValueFrom(
      this.couponService.getCouponPolicy({ id: parseInt(id, 10) }),
    );
  }

  @Get()
  @ApiOperation({ summary: '쿠폰 정책 목록 조회', description: '모든 쿠폰 정책을 페이지네이션하여 조회합니다.' })
  @ApiQuery({ name: 'page', required: false, type: 'number', description: '페이지 번호 (기본값: 0)' })
  @ApiQuery({ name: 'size', required: false, type: 'number', description: '페이지 크기 (기본값: 10)' })
  @ApiResponse({ status: 200, description: '쿠폰 정책 목록 조회 성공' })
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

@ApiTags('Coupon')
@Controller('coupons')
export class CouponController implements OnModuleInit {
  private couponService: CouponService;

  constructor(private readonly dynamicGrpcClient: DynamicGrpcClientService) {}

  onModuleInit() {
    const client = this.dynamicGrpcClient.getCouponClient();
    this.couponService = client.getService<CouponService>('CouponService');
  }

  @Post('issue')
  @ApiOperation({ summary: '쿠폰 발급', description: '사용자에게 쿠폰을 발급합니다.' })
  @ApiResponse({ status: 201, description: '쿠폰이 성공적으로 발급되었습니다.' })
  @ApiResponse({ status: 400, description: '발급 가능한 쿠폰이 없습니다.' })
  async issueCoupon(@Body() dto: IssueCouponRequest) {
    return await firstValueFrom(this.couponService.issueCoupon(dto));
  }

  @Post(':id/use')
  @ApiOperation({ summary: '쿠폰 사용', description: '발급된 쿠폰을 사용 처리합니다.' })
  @ApiParam({ name: 'id', description: '쿠폰 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '쿠폰이 성공적으로 사용되었습니다.' })
  @ApiResponse({ status: 400, description: '쿠폰을 사용할 수 없습니다.' })
  async useCoupon(@Param('id') id: string, @Body() dto: UseCouponRequest) {
    return await firstValueFrom(
      this.couponService.useCoupon({ id: parseInt(id, 10), ...dto }),
    );
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: '쿠폰 취소', description: '사용된 쿠폰을 취소합니다.' })
  @ApiParam({ name: 'id', description: '쿠폰 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '쿠폰이 성공적으로 취소되었습니다.' })
  @ApiResponse({ status: 400, description: '쿠폰을 취소할 수 없습니다.' })
  async cancelCoupon(@Param('id') id: string) {
    return await firstValueFrom(
      this.couponService.cancelCoupon({ id: parseInt(id, 10) }),
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자 쿠폰 조회', description: '특정 사용자의 모든 쿠폰을 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID', type: 'number' })
  @ApiResponse({ status: 200, description: '사용자 쿠폰 목록 조회 성공' })
  async getUserCoupons(@Param('userId') userId: string) {
    return await firstValueFrom(
      this.couponService.getUserCoupons({ userId: parseInt(userId, 10) }),
    );
  }
}
