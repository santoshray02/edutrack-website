#!/bin/bash

# EduTrack Website Deployment Script for GitHub Pages
# Usage: ./deploy.sh "Your commit message"

echo "🚀 EduTrack Website - GitHub Pages Deployment"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not initialized!"
    echo "Run: git init && git remote add origin YOUR_REPO_URL"
    exit 1
fi

# Check if there are changes
if git diff-index --quiet HEAD --; then
    echo "ℹ️  No changes to deploy"
    exit 0
fi

# Get commit message from argument or use default
COMMIT_MSG="${1:-Update: $(date '+%Y-%m-%d %H:%M:%S')}"

echo "📝 Commit message: $COMMIT_MSG"
echo ""

# Add all changes
echo "📦 Adding changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site will be live in 2-3 minutes at:"
echo "   https://YOUR_USERNAME.github.io/edutrack-website/"
echo ""
echo "📊 Check deployment status:"
echo "   https://github.com/YOUR_USERNAME/edutrack-website/actions"
echo ""
