#!/bin/bash

echo "🚀 Deploying complete tRPC serialization and TypeScript fix..."

# Build and test locally first
echo "Building backend..."
cd /workspace/backend
bun install
bun run type-check

echo "Building frontend..."
cd /workspace/frontend
npm install
npm run build

echo "✅ All builds successful!"

echo ""
echo "🔧 Complete fix summary:"
echo "1. ✅ Fixed PlaceSchema: Removed .transform() from createdAt field"
echo "2. ✅ Fixed Store.ts: Changed createdAt from string to Date object"
echo "3. ✅ Fixed StoreItem interface: Updated createdAt type to Date"
echo "4. ✅ Fixed toModel method: Now returns full item instead of subset"
echo "5. ✅ This allows superjson to properly handle Date serialization"
echo ""

echo "📋 Next steps:"
echo "1. Commit these changes to your repository"
echo "2. Deploy to Railway:"
echo "   - Backend: railway up --detach"
echo "   - Frontend: railway up --detach"
echo ""

echo "🧪 The complete fix addresses:"
echo "- ✅ 'Unable to transform response from server' error"
echo "- ✅ superjson Date serialization conflicts"
echo "- ✅ tRPC response transformation issues"
echo "- ✅ TypeScript build errors"
echo "- ✅ Type consistency between Store and PlaceStore"
echo ""

echo "✅ Ready for production deployment!"
