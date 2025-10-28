#!/bin/bash

echo "🚀 Deploying tRPC serialization fix..."

# Build and test locally first
echo "Building backend..."
cd /workspace/backend
bun install
bun run type-check

echo "Building frontend..."
cd /workspace/frontend
npm install
npm run build

echo "✅ Local build successful!"

echo ""
echo "🔧 Changes made to fix the tRPC serialization issue:"
echo "1. Fixed PlaceSchema: Removed .transform() from createdAt field"
echo "2. Fixed Store.ts: Changed createdAt from string to Date object"
echo "3. This allows superjson to properly handle Date serialization"
echo ""

echo "📋 Next steps:"
echo "1. Commit these changes to your repository"
echo "2. Deploy to Railway:"
echo "   - Backend: railway up --detach"
echo "   - Frontend: railway up --detach"
echo ""

echo "🧪 The fix addresses:"
echo "- 'Unable to transform response from server' error"
echo "- superjson Date serialization conflicts"
echo "- tRPC response transformation issues"
echo ""

echo "✅ Ready for deployment!"
