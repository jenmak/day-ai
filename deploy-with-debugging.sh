#!/bin/bash

echo "🚀 Deploying backend with API mounting debugging..."

echo "✅ Added debugging logs to:"
echo "- API app creation"
echo "- API app mounting"
echo "- API app type and methods"

echo ""
echo "🔧 This will help identify why API routes aren't working on Railway"

echo ""
echo "🚀 Deploying to Railway..."
echo "Run: cd backend && railway up --detach"

echo ""
echo "📋 After deployment, check Railway logs:"
echo "railway logs"

echo ""
echo "🔍 Look for these debug messages:"
echo "- '🏗️ Creating API app'"
echo "- '🔗 Mounting API app on /api'"
echo "- '✅ API app mounted successfully'"

echo ""
echo "📋 Then test:"
echo "curl https://dripdropcitybackend-production.up.railway.app/api/test"
echo "curl https://dripdropcitybackend-production.up.railway.app/api/"

echo ""
echo "✅ This should help identify the API mounting issue!"
