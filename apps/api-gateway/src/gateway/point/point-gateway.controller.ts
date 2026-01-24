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

interface PointService {
  earnPoints(data: any): any;
  usePoints(data: any): any;
  cancelPoints(data: any): any;
  getBalance(data: any): any;
  getHistory(data: any): any;
}

@Controller('points')
export class PointController implements OnModuleInit {
  private pointService: PointService;

  constructor(@Inject('POINT_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.pointService = this.client.getService<PointService>('PointService');
  }

  @Post('earn')
  async earnPoints(@Body() dto: any) {
    return await firstValueFrom(this.pointService.earnPoints(dto));
  }

  @Post('use')
  async usePoints(@Body() dto: any) {
    return await firstValueFrom(this.pointService.usePoints(dto));
  }

  @Post('cancel')
  async cancelPoints(@Body() dto: any) {
    return await firstValueFrom(this.pointService.cancelPoints(dto));
  }

  @Get('users/:userId/balance')
  async getBalance(@Param('userId') userId: string) {
    return await firstValueFrom(
      this.pointService.getBalance({ userId: parseInt(userId, 10) }),
    );
  }

  @Get('users/:userId/history')
  async getHistory(
    @Param('userId') userId: string,
    @Query('page') page = 0,
    @Query('size') size = 10,
  ) {
    return await firstValueFrom(
      this.pointService.getHistory({
        userId: parseInt(userId, 10),
        page: parseInt(String(page), 10),
        size: parseInt(String(size), 10),
      }),
    );
  }
}
