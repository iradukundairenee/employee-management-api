#!/bin/bash

echo "🚀 Setting up NestJS Employee Management System..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check your Node.js and npm installation."
    exit 1
fi

# Create database (optional - requires MySQL to be running)
echo "🗄️  Database setup instructions:"
echo "1. Make sure MySQL is running"
echo "2. Create database: CREATE DATABASE employee_management;"
echo "3. Update .env file with your database credentials"

# Redis setup instructions
echo "📡 Redis setup instructions:"
echo "1. Make sure Redis is running: redis-server"
echo "2. Update .env file with Redis configuration if needed"

# Email setup instructions
echo "📧 Email setup instructions:"
echo "1. Update .env file with your email SMTP settings"
echo "2. For Gmail, use app-specific password"

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Update your .env file with proper configuration"
echo "2. Start the application: npm run start:dev"
echo "3. Visit http://localhost:3000/api for Swagger documentation"
echo ""
echo "📋 Available commands:"
echo "  npm run start:dev    - Start in development mode"
echo "  npm run test         - Run unit tests"
echo "  npm run test:cov     - Run tests with coverage"
echo "  npm run test:e2e     - Run e2e tests"
echo "  npm run build        - Build for production"
echo ""