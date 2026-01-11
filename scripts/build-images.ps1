# Docker 이미지 빌드 스크립트 (PowerShell)

param(
    [string]$Version = "latest",
    [string]$Registry = "promotion-system"
)

Write-Host "🚀 Building Docker images for Promotion System..." -ForegroundColor Green
Write-Host "Version: $Version"
Write-Host "Registry: $Registry"
Write-Host ""

# Coupon Service 빌드
Write-Host "📦 Building Coupon Service..." -ForegroundColor Cyan
docker build -t "${Registry}/coupon-service:${Version}" `
  -f apps/coupon-service/Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build Coupon Service" -ForegroundColor Red
    exit 1
}

# Point Service 빌드
Write-Host ""
Write-Host "📦 Building Point Service..." -ForegroundColor Cyan
docker build -t "${Registry}/point-service:${Version}" `
  -f apps/point-service/Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build Point Service" -ForegroundColor Red
    exit 1
}

# Time Sale Service 빌드
Write-Host ""
Write-Host "📦 Building Time Sale Service..." -ForegroundColor Cyan
docker build -t "${Registry}/timesale-service:${Version}" `
  -f apps/timesale-service/Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build Time Sale Service" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All images built successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Images:" -ForegroundColor Yellow
docker images | Select-String $Registry

Write-Host ""
Write-Host "To push to registry:" -ForegroundColor Yellow
Write-Host "  docker push ${Registry}/coupon-service:${Version}"
Write-Host "  docker push ${Registry}/point-service:${Version}"
Write-Host "  docker push ${Registry}/timesale-service:${Version}"
