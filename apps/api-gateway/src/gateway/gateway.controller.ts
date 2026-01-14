import { Controller, All, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';

@ApiTags('gateway')
@Controller()
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) { }

    @All('coupons*')
    @ApiOperation({ summary: 'Coupon Service 프록시', description: '쿠폰 서비스로 요청을 전달합니다' })
    @ApiResponse({ status: 200, description: '요청 성공' })
    @ApiResponse({ status: 502, description: 'Coupon Service 연결 실패' })
    async proxyCoupon(@Req() req, @Res() res) {
        return this.gatewayService.proxyRequest(req, res, 'coupon');
    }

    @All('points*')
    @ApiOperation({ summary: 'Point Service 프록시', description: '적립금 서비스로 요청을 전달합니다' })
    @ApiResponse({ status: 200, description: '요청 성공' })
    @ApiResponse({ status: 502, description: 'Point Service 연결 실패' })
    async proxyPoint(@Req() req, @Res() res) {
        return this.gatewayService.proxyRequest(req, res, 'point');
    }

    @All('timesales*')
    @ApiOperation({ summary: 'Time Sale Service 프록시', description: '타임세일 서비스로 요청을 전달합니다' })
    @ApiResponse({ status: 200, description: '요청 성공' })
    @ApiResponse({ status: 502, description: 'Time Sale Service 연결 실패' })
    async proxyTimeSale(@Req() req, @Res() res) {
        return this.gatewayService.proxyRequest(req, res, 'timesale');
    }
}
