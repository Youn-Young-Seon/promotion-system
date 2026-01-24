# PowerShell script to build all service Docker images

Write-Host "Building Docker images for all services..." -ForegroundColor Green

# Build API Gateway
Write-Host "Building api-gateway..." -ForegroundColor Yellow
docker build -f apps/api-gateway/Dockerfile -t promotion-system/api-gateway:latest .

# Build Coupon Service
Write-Host "Building coupon-service..." -ForegroundColor Yellow
docker build -f apps/coupon-service/Dockerfile -t promotion-system/coupon-service:latest .

# Build Point Service
Write-Host "Building point-service..." -ForegroundColor Yellow
docker build -f apps/point-service/Dockerfile -t promotion-system/point-service:latest .

# Build TimeSale Service
Write-Host "Building timesale-service..." -ForegroundColor Yellow
docker build -f apps/timesale-service/Dockerfile -t promotion-system/timesale-service:latest .

Write-Host "All images built successfully!" -ForegroundColor Green
