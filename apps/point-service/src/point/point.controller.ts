import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PointService } from './point.service';
import { EarnPointsDto, UsePointsDto, CancelPointsDto } from './dto';

@Controller('api/v1/points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('earn')
  async earnPoints(@Body() dto: EarnPointsDto) {
    return this.pointService.earnPoints(dto);
  }

  @Post('use')
  async usePoints(@Body() dto: UsePointsDto) {
    return this.pointService.usePoints(dto);
  }

  @Post('cancel')
  async cancelPoints(@Body() dto: CancelPointsDto) {
    return this.pointService.cancelPoints(dto);
  }

  @Get('users/:userId/balance')
  async getBalance(@Param('userId', ParseIntPipe) userId: number) {
    return this.pointService.getBalance(userId);
  }

  @Get('users/:userId/history')
  async getHistory(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', ParseIntPipe) page = 0,
    @Query('size', ParseIntPipe) size = 10,
  ) {
    return this.pointService.getHistory(userId, page, size);
  }
}
