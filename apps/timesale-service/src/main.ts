import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const logger = new Logger('TimeSaleService');
  const app = await NestFactory.create(AppModule);

  const httpPort = process.env.SERVICE_PORT ?? 3003;
  const grpcPort = process.env.GRPC_PORT ?? 50053;

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  // CORS
  app.enableCors();

  // gRPC 마이크로서비스 연결
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'timesale',
      protoPath: join(__dirname, '../../../proto/timesale.proto'),
      url: `0.0.0.0:${grpcPort}`,
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);

  logger.log(`TimeSale Service (REST) is running on port ${httpPort}`);
  logger.log(`TimeSale Service (gRPC) is running on port ${grpcPort}`);
}

void bootstrap();
