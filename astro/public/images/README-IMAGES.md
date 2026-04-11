# Required Images for SEO

The following image files need to be created for optimal SEO:

## Favicon Files
- [x] `favicon.svg` - Already exists
- [ ] `favicon-32x32.png` - 32x32 PNG version
- [ ] `favicon-16x16.png` - 16x16 PNG version
- [ ] `apple-touch-icon.png` - 180x180 PNG for iOS

## Social Media Images
- [ ] `og-image.jpg` - 1200x630 for Open Graph (Facebook, LinkedIn)
- [ ] `twitter-card.jpg` - 1200x600 for Twitter
- [ ] `logo.png` - PNG version of logo for schema markup

## How to Create These:

### From favicon.svg:
```bash
# Install imagemagick if not already installed
# sudo apt install imagemagick

# Create PNG versions from SVG
convert -background none favicon.svg -resize 32x32 favicon-32x32.png
convert -background none favicon.svg -resize 16x16 favicon-16x16.png
convert -background none favicon.svg -resize 180x180 apple-touch-icon.png
convert -background none logo.svg -resize 512x512 logo.png
```

### Social Media Images:
Create 1200x630 image with:
- EduTrack logo
- Text: "India's GenAI School Management"
- Subtitle: "Ask in Hindi, Get Instant Answers"
- Price: "Starting ₹18K/year"
- Purple-blue gradient background matching brand colors

## Temporary Workaround:
Until proper images are created, the references in index.html will gracefully fail.
Browsers will use favicon.svg as fallback.
