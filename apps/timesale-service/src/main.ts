import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { LoggerService, EtcdService } from '@common/index';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggerService);
  logger.setContext('Bootstrap');
  app.useLogger(logger);

  const httpPort = process.env['SERVICE_PORT'] ?? 3003;
  const grpcPort = process.env['GRPC_PORT'] ?? 50053;
  const serviceName = process.env['SERVICE_NAME'] ?? 'timesale-service';
  const serviceHost = process.env['SERVICE_HOST'] ?? 'localhost';

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
        keepCase: false, // NestJS best practice: proto uses snake_case, TypeScript uses camelCase
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

  // etcd에 서비스 등록
  const etcdService = app.get(EtcdService);
  await etcdService.registerService(serviceName, {
    host: serviceHost,
    port: Number(grpcPort),
    protocol: 'grpc',
  });

  logger.log(`Service registered to etcd: ${serviceName} at ${serviceHost}:${grpcPort}`);
}

void bootstrap();
