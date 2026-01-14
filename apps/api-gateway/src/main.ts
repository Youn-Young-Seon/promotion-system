import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
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

    console.log(`🚀 API Gateway is running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
    console.log(`🔗 Proxying to:`);
    console.log(`   - Coupon Service: http://localhost:3001`);
    console.log(`   - Point Service: http://localhost:3002`);
    console.log(`   - Time Sale Service: http://localhost:3003`);
}
bootstrap();
