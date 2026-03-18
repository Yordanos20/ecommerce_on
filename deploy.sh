#!/bin/bash

# E-Commerce Marketplace Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Starting E-Commerce Marketplace Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual configuration before running again."
    exit 1
fi

# Load environment variables
source .env

echo "🔧 Building and starting containers..."

# Stop existing containers
docker-compose down

# Build and start new containers
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."

# Check MySQL
if docker-compose exec mysql mysqladmin ping -h localhost --silent; then
    echo "✅ MySQL is running"
else
    echo "❌ MySQL failed to start"
    exit 1
fi

# Check Backend
if curl -f http://localhost:5000/api/test > /dev/null 2>&1; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API failed to start"
    exit 1
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:5000"
echo "📍 Database: localhost:3306"

echo ""
echo "📋 Next steps:"
echo "1. Access the application at http://localhost:3000"
echo "2. Login as admin: madmin@gmail.com / 123456"
echo "3. Configure your Chapa payment gateway in the .env file"
echo "4. Set up your domain and SSL certificate for production"

echo ""
echo "🔧 Useful commands:"
echo "- View logs: docker-compose logs -f"
echo "- Stop services: docker-compose down"
echo "- Restart services: docker-compose restart"
echo "- Access database: docker-compose exec mysql mysql -u root -p"
