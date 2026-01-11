#!/bin/bash

# Docker 이미지 빌드 스크립트

set -e

echo "🚀 Building Docker images for Promotion System..."

# 버전 설정
VERSION=${1:-latest}
REGISTRY=${2:-promotion-system}

echo "Version: $VERSION"
echo "Registry: $REGISTRY"

# Coupon Service 빌드
echo ""
echo "📦 Building Coupon Service..."
docker build -t $REGISTRY/coupon-service:$VERSION \
  -f apps/coupon-service/Dockerfile .

# Point Service 빌드
echo ""
echo "📦 Building Point Service..."
docker build -t $REGISTRY/point-service:$VERSION \
  -f apps/point-service/Dockerfile .

# Time Sale Service 빌드
echo ""
echo "📦 Building Time Sale Service..."
docker build -t $REGISTRY/timesale-service:$VERSION \
  -f apps/timesale-service/Dockerfile .

echo ""
echo "✅ All images built successfully!"
echo ""
echo "Images:"
docker images | grep $REGISTRY

echo ""
echo "To push to registry:"
echo "  docker push $REGISTRY/coupon-service:$VERSION"
echo "  docker push $REGISTRY/point-service:$VERSION"
echo "  docker push $REGISTRY/timesale-service:$VERSION"
