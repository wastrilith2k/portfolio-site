#!/bin/bash

# Portfolio Site Deployment Script
echo "🚀 Starting deployment process..."

# Build the project
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"

    # Deploy to Firebase
    echo "🔥 Deploying to Firebase..."
    firebase deploy --only hosting

    if [ $? -eq 0 ]; then
        echo "🎉 Deployment completed successfully!"
        echo "🌐 Site URL: https://portfolio-site-9fd4f.web.app"
    else
        echo "❌ Firebase deployment failed"
        exit 1
    fi
else
    echo "❌ Build failed - deployment cancelled"
    exit 1
fi