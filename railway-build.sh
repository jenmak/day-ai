#!/bin/bash

echo "🚀 Starting Railway build process..."

# Copy shared files to backend for Railway deployment
echo "📁 Copying shared files to backend..."
mkdir -p backend/app/shared
cp -r shared/schemas backend/app/shared/
cp -r shared/types backend/app/shared/
cp -r shared/consts backend/app/shared/
cp shared/constants.ts backend/app/
cp shared/config.ts backend/app/

# Update backend imports to use local shared files
echo "🔧 Updating backend imports..."
find backend/app -name "*.ts" -exec sed -i 's|@dripdropcity/shared/schemas|../shared/schemas|g' {} \;
find backend/app -name "*.ts" -exec sed -i 's|@dripdropcity/shared/types|../shared/types|g' {} \;
find backend/app -name "*.ts" -exec sed -i 's|@dripdropcity/shared/constants|../constants|g' {} \;

echo "✅ Railway build completed successfully"
