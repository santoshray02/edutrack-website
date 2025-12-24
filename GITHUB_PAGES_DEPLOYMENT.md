# Deploy EduTrack Website to GitHub Pages

## 🚀 Quick Deployment Guide

### Prerequisites
- Git installed on your system
- GitHub account
- Repository created (or will create one)

---

## Step 1: Initialize Git Repository (if not already done)

```bash
cd /home/santosh/projects/experiments/edutrack-website

# Initialize git if not already done
git init

# Check current status
git status
```

---

## Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `edutrack-website`
3. Description: "EduTrack - GenAI-Powered School Management System for 2026"
4. **Choose**: Public (for GitHub Pages to work for free)
5. **Don't** initialize with README (we already have files)
6. Click "Create repository"

---

## Step 3: Commit and Push Your Code

```bash
# Add all files
git add .

# Commit with message
git commit -m "Initial commit: EduTrack GenAI website for 2026"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/edutrack-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Enable GitHub Pages

### Option A: Via GitHub Web Interface (Easiest)

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/edutrack-website`
2. Click **Settings** (top right)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 2-3 minutes for deployment
7. Your site will be live at: `https://YOUR_USERNAME.github.io/edutrack-website/`

### Option B: Via GitHub Actions (Automated)

Create a GitHub Actions workflow file (already prepared below).

---

## Step 5: Custom Domain (Optional)

If you want to use a custom domain like `edutrack.santoshray.in`:

1. In GitHub Settings → Pages:
   - Enter custom domain: `edutrack.santoshray.in`
   - Click Save

2. In your DNS provider (where you bought the domain):
   - Add a CNAME record:
     - Name: `edutrack` (or `@` for root domain)
     - Value: `YOUR_USERNAME.github.io`
   - Or add A records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. Wait for DNS propagation (5-60 minutes)

---

## Files Structure for GitHub Pages

Your current structure is perfect:

```
edutrack-website/
├── index.html          ← Main page (GitHub Pages serves this automatically)
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
│   └── (add your images here)
└── README.md
```

**Note**: GitHub Pages automatically serves `index.html` as the homepage.

---

## Troubleshooting

### Issue: 404 Page Not Found
- **Solution**: Make sure `index.html` is in the root directory
- Check branch name is `main` (not `master`)
- Wait 2-3 minutes for deployment to complete

### Issue: CSS/JS Not Loading
- **Solution**: Check file paths are relative (not absolute)
- Current paths are correct: `css/styles.css`, `js/script.js`

### Issue: Images Not Loading
- **Solution**: Add images to `images/` folder
- Reference them as: `images/your-image.png`

---

## Update Your Website

After making changes:

```bash
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with message
git commit -m "Update: Added GenAI features for 2026"

# 4. Push to GitHub
git push origin main

# 5. Wait 1-2 minutes for automatic redeployment
```

---

## Environment-Specific URLs

After deployment, update these in your website:

1. **Social sharing**: Update OG tags with your GitHub Pages URL
2. **Analytics**: Add Google Analytics tracking ID (optional)
3. **Contact forms**: Update any API endpoints if needed

---

## Performance Optimization for GitHub Pages

GitHub Pages is already optimized, but you can:

1. **Enable HTTPS**: Automatically enabled by GitHub
2. **CDN**: GitHub Pages uses Fastly CDN (built-in)
3. **Caching**: Already optimized by GitHub
4. **Compression**: Gzip enabled by default

---

## Cost

**FREE!** 🎉
- GitHub Pages is free for public repositories
- Unlimited bandwidth
- Custom domain support (free)
- HTTPS/SSL certificate (free)

---

## Next Steps After Deployment

1. **Test the live site**: Visit your GitHub Pages URL
2. **Check mobile responsiveness**: Test on phone
3. **Verify all links work**: Click through all CTAs
4. **Test phone/WhatsApp links**: Make sure they work
5. **SEO**: Submit to Google Search Console
6. **Analytics**: Add Google Analytics (optional)

---

## Quick Deploy Script

Save this as `deploy.sh` for easy updates:

```bash
#!/bin/bash

echo "🚀 Deploying EduTrack to GitHub Pages..."

# Add all changes
git add .

# Commit with timestamp
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
git push origin main

echo "✅ Deployed! Site will be live in 2-3 minutes."
echo "🌐 URL: https://YOUR_USERNAME.github.io/edutrack-website/"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Use it:
```bash
./deploy.sh
```

---

## Example: Full Deployment Flow

```bash
# 1. Navigate to project
cd /home/santosh/projects/experiments/edutrack-website

# 2. Initialize git (if needed)
git init

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: EduTrack GenAI 2026 website"

# 5. Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/edutrack-website.git

# 6. Push to GitHub
git branch -M main
git push -u origin main

# 7. Enable GitHub Pages via web interface (see Step 4)

# 8. Wait 2-3 minutes

# 9. Visit: https://YOUR_USERNAME.github.io/edutrack-website/

# 🎉 Done!
```

---

## Final URLs

After deployment:

- **GitHub Pages URL**: `https://YOUR_USERNAME.github.io/edutrack-website/`
- **Custom Domain** (if configured): `https://edutrack.santoshray.in`
- **Repository**: `https://github.com/YOUR_USERNAME/edutrack-website`

---

## Support

If you encounter issues:

1. Check [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Check repository Settings → Pages for error messages
3. Verify your repository is public
4. Check Actions tab for deployment status

---

**Your GenAI-powered EduTrack website is ready to go live! 🚀**
