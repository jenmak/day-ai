#!/bin/bash

echo "🚀 Deploying backend fixes to Railway..."

echo "1. ✅ Fixed import paths (.js → .ts)"
echo "2. ✅ Updated nixpacks.toml for proper Bun usage"
echo "3. ✅ Updated package.json start script"
echo "4. ✅ Fixed frontend to use correct Railway backend URL"

echo ""
echo "🔧 Backend deployment issues identified:"
echo "- Import path issues preventing startup"
echo "- nixpacks configuration not using Bun properly"
echo "- TypeScript files not being handled correctly"

echo ""
echo "✅ All fixes applied:"
echo "- src/index.ts: Fixed import path"
echo "- nixpacks.toml: Updated to use 'bun server.js'"
echo "- package.json: Updated start script"
echo "- frontend/server.js: Fixed backend URL"

echo ""
echo "🚀 Deploying to Railway..."
echo "Run: railway up --detach"
echo ""
echo "📋 After deployment, test with:"
echo "curl https://dripdropcitybackend-production.up.railway.app/"
echo "curl https://dripdropcitybackend-production.up.railway.app/api/test"
echo ""
echo "✅ Backend should now start properly on Railway!"
