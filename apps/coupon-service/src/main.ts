import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.setGlobalPrefix('api');

    // Swagger 설정
    const config = new DocumentBuilder()
        .setTitle('Coupon Service API')
        .setDescription('쿠폰 발급 및 관리 API')
        .setVersion('1.0')
        .addTag('coupons')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // gRPC Microservice 설정
    const grpcUrl = process.env.GRPC_URL || '0.0.0.0:5001';
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'coupon',
            protoPath: join(__dirname, '../../../proto/coupon.proto'),
            url: grpcUrl,
        },
    });

    await app.startAllMicroservices();

    const port = process.env.PORT || 3001;
    await app.listen(port);

    logger.log(`Coupon Service is running on: http://localhost:${port}`);
    logger.log(`Coupon gRPC Service is running on: ${grpcUrl}`);
    logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
