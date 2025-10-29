#!/bin/bash

# Drip Drop City Backend Railway Deployment Script
# This script builds and deploys the backend to Railway using Bun

set -e  # Exit on any error

echo "🚂 Starting Drip Drop City Backend Railway Deployment..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Error: Bun is not installed. Please install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Error: Railway CLI is not installed. Please install it first:"
    echo "   npm install -g @railway/cli"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Run type checking
echo "🔍 Running type check..."
bun run type-check

# Build the project
echo "🔨 Building project..."
bun run build

echo "✅ Build completed successfully"

# Deploy to Railway
echo "🚂 Deploying to Railway..."
railway up --detach

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Railway dashboard:"
echo "   - NODE_ENV=production"
echo ""
echo "2. Test your deployment:"
echo "   - Health check: https://your-railway-url.railway.app/"
echo "   - Test endpoint: https://your-railway-url.railway.app/test"
echo ""
echo "3. Update your frontend configuration with the new backend URL"
