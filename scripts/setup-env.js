const fs = require('fs');
const path = require('path');

/**
 * 자동으로 .env.example 파일을 .env로 복사하는 스크립트
 * Git clone 후 npm install 시 자동 실행됩니다.
 */

const services = ['coupon-service', 'point-service', 'timesale-service'];

console.log('🔧 Setting up environment files...\n');

services.forEach(service => {
    const servicePath = path.join(__dirname, '..', 'apps', service);
    const exampleEnvPath = path.join(servicePath, '.env.example');
    const envPath = path.join(servicePath, '.env');

    // .env 파일이 이미 존재하는지 확인
    if (fs.existsSync(envPath)) {
        console.log(`✓ ${service}: .env already exists (skipping)`);
        return;
    }

    // .env.example 파일이 존재하는지 확인
    if (!fs.existsSync(exampleEnvPath)) {
        console.log(`⚠ ${service}: .env.example not found (skipping)`);
        return;
    }

    // .env.example을 .env로 복사
    try {
        fs.copyFileSync(exampleEnvPath, envPath);
        console.log(`✓ ${service}: Created .env from .env.example`);
    } catch (error) {
        console.error(`✗ ${service}: Failed to create .env - ${error.message}`);
    }
});

console.log('\n✅ Environment setup complete!\n');
