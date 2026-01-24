import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule, KafkaModule } from '@common/index';
import { PointModule } from './point/point.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    KafkaModule,
    PointModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
