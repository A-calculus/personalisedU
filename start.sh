#!/bin/bash

# Ensure we're in production mode
export NODE_ENV=production

# Check if .next directory exists
if [ ! -d ".next" ]; then
  echo "Error: .next directory not found. Please run 'npm run build' first."
  exit 1
fi

# Start the server
echo "Starting Next.js server in production mode..."
npm start 