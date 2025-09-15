#!/bin/bash

# DayAI Deployment Script
# This script deploys both frontend and backend to Vercel

set -e

echo "🚀 Starting DayAI deployment..."

# Deploy backend first
echo "📦 Deploying backend..."
cd backend
vercel --prod
echo "✅ Backend deployed successfully"

# Since we're using a consistent name, we know the URL
BACKEND_URL="https://day-ai-backend.vercel.app"
echo "🔗 Backend URL: $BACKEND_URL"

# The frontend is already configured to use the consistent domain
echo "⚙️  Frontend already configured for consistent domain"

# Build and deploy frontend
echo "📦 Building and deploying frontend..."
cd ../frontend

# Fix npm/rollup dependency issue
echo "🔧 Fixing npm dependencies..."
rm -rf node_modules package-lock.json
npm install

# Build with npm instead of bun to avoid the rollup issue
echo "📦 Building frontend..."
npm run build
vercel --prod --name day-ai-frontend
echo "✅ Frontend deployed successfully"

echo "🎉 Deployment complete!"
echo "Frontend: https://day-ai-frontend.vercel.app"
echo "Backend: $BACKEND_URL"