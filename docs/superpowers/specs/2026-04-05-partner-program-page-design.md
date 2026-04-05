# Partner Program Page — Design Spec

**Date:** 2026-04-05
**Status:** Approved
**Deliverable:** `/partners.html` — a dedicated, SEO-friendly partner program page for the EdunodeX website

---

## Overview

A single long-form page at `/partners.html` that presents EdunodeX's partner program to potential referral, reseller, implementation, and integration partners across India. The page follows the existing site's design language (Tailwind CSS, Inter font, purple-blue gradients) and uses a Google Form for partner applications.

## Target Audience

- School consultants and retired principals (Referral)
- Local IT vendors and education distributors in tier 2/3 cities (Reseller)
- Freelancers and agencies experienced in school software setup (Implementation)
- Biometric, payment, SMS, and ed-tech product vendors (Integration)

## Page Structure (Top to Bottom)

### 1. Hero Section
- **Headline:** "Grow With EdunodeX — Become a Partner"
- **Subtext:** "Help schools across India modernize with AI-powered management. Earn recurring income while transforming education."
- **Primary CTA:** "Apply Now" → Google Form (new tab)
- **Secondary CTA:** "Learn More" → smooth scroll to Why Partner section
- **Style:** Purple-blue gradient background (`#667eea → #764ba2`), white text, consistent with main site hero

### 2. Why Partner with EdunodeX
- 4 value proposition cards in a horizontal grid:
  - **Growing Market** — 3L+ schools digitizing in India
  - **Recurring Income** — Earn every month, not just once
  - **Easy to Sell** — ₹10/student/month, schools say yes fast
  - **Full Support** — Training, marketing kit, partner manager
- **Style:** Light background (`#f8f9ff`), white cards with subtle shadow

### 3. Partner Types (Choose Your Partner Type)
- 4 cards in a 2×2 grid, each containing: icon, title, who it's for, what you do, what you earn, example earnings
- **Referral Partner:** ₹3,000 signup bonus + 15% revenue share for 12 months. Example: 500-student school = ₹12,000/yr
- **Reseller Partner (MOST POPULAR badge):** ₹5,000 signup bonus + 20% revenue share for 24 months. Example: 500-student school = ₹29,000/2yr
- **Implementation Partner:** Charge schools directly ₹10K–₹25K. EdunodeX takes no cut.
- **Integration Partner:** Co-marketing + API access. Mutual benefit, no commission.
- Referral and Reseller cards have gradient borders; Implementation and Integration have subtle borders

### 4. Commission Structure Table
- Table with gradient header row, 4 data rows:
  - 200 students: Referral ₹6,600/yr, Reseller ₹14,600/2yr
  - 500 students: Referral ₹12,000/yr, Reseller ₹29,000/2yr
  - 1,000 students: Referral ₹21,000/yr, Reseller ₹53,000/2yr
  - 5 schools (500 avg): Referral ₹60,000/yr, Reseller ₹1,45,000/2yr (bold, highlighted)
- Footer note: "Payouts processed monthly via bank transfer. Minimum payout: ₹1,000."

### 5. How It Works
- 3-step horizontal flow with numbered circles and arrows:
  1. **Apply** — Fill out the form, takes 2 minutes
  2. **Get Approved** — Team connects within 48 hours with training & materials
  3. **Start Earning** — Share EdunodeX, track referrals, earn monthly

### 6. Partner Benefits
- 2×3 grid of benefit cards:
  - Training & Onboarding — Product walkthrough & sales training via video call
  - Marketing Kit — Brochures, demo videos, decks in Hindi & English
  - Dedicated Partner Manager — Single point of contact for support
  - Priority Support — Fast-track support for referred schools
  - Real-Time Tracking — Referral & commission tracking (shared sheet, dashboard later)
  - Exclusive Events — Quarterly meetups & early feature access

### 7. Coverage Map
- Pan-India focus with priority state pills/badges: Bihar, Madhya Pradesh, Uttar Pradesh, Jharkhand, Rajasthan, Chhattisgarh
- Subtext: "We're actively looking for partners in highlighted states, but welcome applications from across India."
- Style: State names as gradient pill badges, not an actual map image

### 8. FAQ
- 6 questions in accordion or static list format (static preferred for SEO):
  1. Who can become a partner? — Anyone with school connections
  2. Is there any fee to join? — No, completely free
  3. How are commissions paid? — Monthly bank transfer, min ₹1,000
  4. Can I combine partner types? — Yes
  5. What support do I get? — Marketing kit, training, partner manager, priority support
  6. How do I track referrals? — Live tracking sheet, dashboard coming soon

### 9. Final CTA
- **Headline:** "Ready to Grow With Us?"
- **Subtext:** "Join India's fastest-growing school OS partner network. Apply in 2 minutes."
- **Primary CTA:** "Apply Now →" → Google Form (new tab)
- **Secondary CTA:** "Talk to Us" → WhatsApp (`wa.me/917880170555?text=Hi, I'm interested in the EdunodeX Partner Program`)
- **Style:** Purple-blue gradient background, matching hero

### 10. Footer
- Same footer as main site (`index.html`)
- Add "Partner Program" link in footer navigation

## Navigation Changes

- Add **"Partners"** link in the main navbar between "Pricing" and "Contact"
- Link points to `/partners.html`
- Update both desktop and mobile nav menus

## Application Flow

- All "Apply Now" buttons link to a **Google Form** (external, opens in new tab)
- Google Form fields: Name, Phone, Email, City/State, Partner Type (dropdown: Referral / Reseller / Implementation / Integration), Number of schools you currently work with, How did you hear about EdunodeX?
- Form responses go to a Google Sheet for manual review
- The Google Form URL will be configured as a variable at the top of the JS file for easy updates

## SEO

- **Title tag:** "EdunodeX Partner Program — Earn Recurring Income Selling India's School OS"
- **Meta description:** "Join EdunodeX's partner program. Earn up to ₹1,45,000 per year as a school software reseller. Free to join, training provided, monthly payouts."
- **Structured data:** Add the page to `sitemap.xml`
- **FAQ schema:** FAQPage structured data for the 6 FAQ items

## Design Constraints

- **Tech:** Plain HTML + Tailwind CSS (CDN) + vanilla JS — same stack as main site
- **Font:** Inter (Google Fonts) — already loaded
- **Colors:** Primary gradient `#667eea → #764ba2`, secondary `#f093fb → #f5576c`, accent `#4facfe → #00f2fe`
- **Responsive:** Mobile-first, same breakpoints as main site
- **No build step:** Static HTML file, no bundler needed
- **Analytics:** Google Analytics event tracking on all CTAs (same pattern as main site)

## Out of Scope

- Partner portal/dashboard (future — when 20+ active partners)
- Automated commission tracking system
- Partner login or authentication
- Interactive India map (using pill badges instead)
- Tiered certification programs
- API partner documentation
