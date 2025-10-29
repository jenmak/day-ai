#!/bin/bash

echo "🚀 Deploying backend with tRPC debugging..."

echo "✅ Added debugging to tRPC handler:"
echo "- Content-Type logging"
echo "- Request body logging"
echo "- URL modification logging"

echo ""
echo "🎯 This will help identify:"
echo "- What request format is being received"
echo "- How the request body is being parsed"
echo "- What's causing the 500 error"

echo ""
echo "🚀 Deploying to Railway..."
echo "Run: cd backend && railway up --detach"

echo ""
echo "📋 After deployment, test and check logs:"
echo "1. Test: curl -X POST https://dripdropcity.com/api/trpc/places.create -H 'Content-Type: application/json' -d '{\"json\":{\"description\": \"Eiffel Tower\"}}'"
echo "2. Check logs: railway logs"
echo "3. Look for: 'Content-Type:', 'Request body:', 'Modified URL:'"

echo ""
echo "✅ This should reveal the exact issue with tRPC processing!"
