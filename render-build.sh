#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Install TypeScript dependencies
echo "Installing TypeScript dependencies..."
npm install --save-dev typescript @types/react @types/react-dom @types/node

# Run the build
echo "Running build..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build completed successfully!"
  exit 0
else
  echo "Build failed!"
  exit 1
fi 