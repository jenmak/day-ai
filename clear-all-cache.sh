#!/bin/bash

echo "🧹 Clearing all cached city data..."

# Clear backend cache files
echo "Clearing backend cache..."
cd /workspace/backend
rm -f tmp/places.json tmp/cache.json
mkdir -p tmp
echo '{"json":[],"meta":{"values":{}}}' > tmp/places.json
echo "✅ Backend cache cleared"

# Clear any other potential cache files
echo "Clearing other cache files..."
find /workspace -name "*.cache" -delete 2>/dev/null || true
find /workspace -name "cache.json" -delete 2>/dev/null || true
echo "✅ Other cache files cleared"

# Clear frontend build cache
echo "Clearing frontend build cache..."
cd /workspace/frontend
rm -rf dist/ node_modules/.vite/ 2>/dev/null || true
echo "✅ Frontend build cache cleared"

echo ""
echo "🎉 All cached city data has been cleared!"
echo ""
echo "📝 To clear frontend localStorage cache:"
echo "   1. Open browser Developer Tools (F12)"
echo "   2. Go to Application/Storage tab"
echo "   3. Find 'Local Storage' → your domain"
echo "   4. Delete the 'place-store' key"
echo "   5. Refresh the page"
echo ""
echo "🔄 Restart your servers to ensure clean state:"
echo "   Backend:  cd /workspace/backend && bun run dev"
echo "   Frontend: cd /workspace/frontend && npm run dev"
