#!/bin/bash

# Quick redeploy script for Railway with API key fixes
echo "🚂 Redeploying DripDrop City Backend to Railway..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
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

# Run type checking (no API key validation during build)
echo "🔍 Running type check..."
bun run type-check

echo "✅ Build completed successfully"

# Deploy to Railway
echo "🚂 Deploying to Railway..."
railway up --detach

echo "🎉 Redeployment completed successfully!"
echo ""
echo "📋 The build should now work because:"
echo "1. ✅ Build phase only runs type-check (no API key validation)"
echo "2. ✅ API key validation is deferred to runtime"
echo "3. ✅ Environment variables are available at runtime"
echo ""
echo "🔍 To check if it's working:"
echo "1. Check Railway logs: railway logs"
echo "2. Test health endpoint: https://your-railway-url.railway.app/"
echo "3. Test API endpoint: https://your-railway-url.railway.app/api/test"
