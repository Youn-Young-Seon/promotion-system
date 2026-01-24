#!/bin/bash

# Build all service Docker images

echo "Building Docker images for all services..."

# Build API Gateway
echo "Building api-gateway..."
docker build -f apps/api-gateway/Dockerfile -t promotion-system/api-gateway:latest .

# Build Coupon Service
echo "Building coupon-service..."
docker build -f apps/coupon-service/Dockerfile -t promotion-system/coupon-service:latest .

# Build Point Service
echo "Building point-service..."
docker build -f apps/point-service/Dockerfile -t promotion-system/point-service:latest .

# Build TimeSale Service
echo "Building timesale-service..."
docker build -f apps/timesale-service/Dockerfile -t promotion-system/timesale-service:latest .

echo "All images built successfully!"
