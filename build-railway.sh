#!/bin/bash
set -e

echo "Building for Railway deployment..."

# Create directories
mkdir -p backend/app/schemas
mkdir -p backend/app/types
mkdir -p backend/app/consts

# Copy shared files
cp shared/schemas/* backend/app/schemas/
cp shared/types/* backend/app/types/
cp shared/consts/* backend/app/consts/
cp shared/constants.ts backend/app/
cp shared/config.ts backend/app/

# Update imports
find backend/app -name '*.ts' -exec sed -i 's|@dripdropcity/shared/schemas|../schemas|g' {} \;
find backend/app -name '*.ts' -exec sed -i 's|@dripdropcity/shared/types|../types|g' {} \;
find backend/app -name '*.ts' -exec sed -i 's|@dripdropcity/shared/constants|../constants|g' {} \;

echo "Railway build completed successfully"
