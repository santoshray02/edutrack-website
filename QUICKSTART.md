# EduTrack Website - Quick Start Guide

## View the Website

### Option 1: Open Directly (Simplest)
```bash
cd /home/santosh/projects/experiments/erpnext-school/website
xdg-open index.html
```

### Option 2: Local Web Server (Recommended)

Using Python (recommended):
```bash
cd /home/santosh/projects/experiments/erpnext-school/website
python3 -m http.server 8080
```
Then visit: http://localhost:8080

### Option 3: Add to Docker Compose

Add this service to your existing `docker-compose.yml`:

```yaml
  website:
    image: nginx:alpine
    container_name: edutrack-website
    ports:
      - "10226:80"
    volumes:
      - ./website:/usr/share/nginx/html:ro
    restart: unless-stopped
```

Then run:
```bash
docker compose up -d website
```

Visit: http://localhost:10226 or http://internal3.paperentry.ai:10226

## Features

✅ **AI-Powered branding** - Highlights intelligent features
✅ **Simplified workflow messaging** - Clear value proposition
✅ **Accurate pricing** - ₹15,000 - ₹40,000/year + setup fees
✅ **Payment terms** - GST, SMS, hosting all documented
✅ **Contact info** - Real phone (9939022412) and email
✅ **Developer credits** - Santosh Kumar with GSTIN
✅ **Mobile-optimized** - Works perfectly on phones
✅ **Lightweight** - < 100KB total size

## Key Updates Made

1. **Branding**: Changed from SchoolPro to EduTrack
2. **Tagline**: "Track Every Student, Every Fee, Every Day"
3. **AI Focus**: Highlighted AI-powered intelligence features
4. **Pricing**:
   - Small: ₹15,000/year + ₹5,000 setup
   - Medium: ₹25,000/year + ₹8,000 setup (Most Popular)
   - Large: ₹40,000/year + ₹12,000 setup
5. **Payment Terms**:
   - 18% GST extra
   - 100% advance payment
   - Server hosting: ₹3,000-₹6,000/year
   - SMS: ₹0.20 per SMS + ₹5,900 DLT registration
6. **Contact**:
   - Phone: 9939022412
   - Email: rayskumar02@gmail.com
   - Developer: Santosh Kumar
   - GSTIN: 29DEQPK4166G1ZZ

## Next Steps

1. **Test on mobile devices** - Open on your phone to check responsiveness
2. **Review content** - Ensure all details are accurate
3. **Add real screenshots** (optional) - Create images/ folder
4. **Deploy to production** - Use nginx or host on Vercel/Netlify (free)

## Deploy to Production

### Free Hosting Options:

**Vercel (Recommended)**:
```bash
cd website
npx vercel --prod
```

**Netlify**:
```bash
cd website
npx netlify deploy --prod --dir=.
```

**GitHub Pages**:
```bash
cd website
git init
git add .
git commit -m "Initial website"
# Push to GitHub and enable Pages
```

## Customization

To update content, edit these files:
- `index.html` - All content and structure
- `css/styles.css` - Colors and styling
- `js/script.js` - Form handling and animations

Colors are defined in CSS variables at the top of styles.css - easy to change the entire theme by modifying just a few values.

---

**Questions?** Contact Santosh Kumar at rayskumar02@gmail.com or call 9939022412
