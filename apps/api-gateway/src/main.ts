import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

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
    app.enableCors();

    // Swagger 통합 문서
    const config = new DocumentBuilder()
        .setTitle('Promotion System API Gateway')
        .setDescription('통합 프로모션 시스템 API - 쿠폰, 적립금, 타임세일 서비스 통합')
        .setVersion('1.0')
        .addTag('gateway', 'API Gateway Health Check')
        .addTag('coupons', 'Coupon Service')
        .addTag('points', 'Point Service')
        .addTag('timesales', 'Time Sale Service')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.GATEWAY_PORT || 4000;
    await app.listen(port);

    logger.log(`🚀 API Gateway is running on: http://localhost:${port}`);
    logger.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
    logger.log(`🔗 Proxying to:`);
    logger.log(`   - Coupon Service: http://localhost:3001`);
    logger.log(`   - Point Service: http://localhost:3002`);
    logger.log(`   - Time Sale Service: http://localhost:3003`);
}
bootstrap();
