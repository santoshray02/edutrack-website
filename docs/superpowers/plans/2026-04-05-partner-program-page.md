# Partner Program Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated `/partners.html` page for the EdunodeX website with 4 partner types, commission structure, FAQ, and Google Form application flow.

**Architecture:** Single static HTML page following the existing site pattern (Tailwind CSS CDN + Flowbite + Inter font + custom CSS). No build step. Page uses the same nav/footer structure as `index.html` and blog pages.

**Tech Stack:** HTML5, Tailwind CSS (CDN), Flowbite 2.2.1, vanilla JS, Google Analytics (GT-MKBHFCK6)

**Spec:** `docs/superpowers/specs/2026-04-05-partner-program-page-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `partners.html` | Full partner program page |
| Modify | `index.html:250-256` | Add "Partners" link to desktop/mobile nav |
| Modify | `index.html:1591-1598` | Add "Partners" link to footer |
| Modify | `sitemap.xml` | Add partners page entry |

---

### Task 1: Create partners.html with head, nav, and hero

**Files:**
- Create: `partners.html`

- [ ] **Step 1: Create the HTML file with head section and nav**

Create `partners.html` with the full `<head>` (matching blog page pattern: meta tags, OG, Twitter, Tailwind CDN, Flowbite, Inter font, GA, structured data) and the navbar copied from `index.html` with "Partners" link active.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags -->
    <title>EdunodeX Partner Program — Earn Recurring Income Selling India's School OS</title>
    <meta name="description" content="Join EdunodeX's partner program. Earn up to ₹1,45,000 per year as a school software reseller. Free to join, training provided, monthly payouts.">
    <meta name="keywords" content="EdunodeX partner program, school software reseller India, education partner program, school ERP channel partner, referral program school software">
    <meta name="author" content="Xentovia Tech Pvt Ltd">
    <meta name="theme-color" content="#9333EA">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://edunodex.in/partners">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://edunodex.in/partners">
    <meta property="og:title" content="EdunodeX Partner Program — Earn Recurring Income">
    <meta property="og:description" content="Join EdunodeX's partner program. 4 partner types, up to 20% revenue share, free to join. Help schools modernize across India.">
    <meta property="og:image" content="https://edunodex.in/images/og-image.jpg">
    <meta property="og:locale" content="en_IN">
    <meta property="og:site_name" content="EdunodeX">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="EdunodeX Partner Program — Earn Recurring Income">
    <meta name="twitter:description" content="Join EdunodeX's partner program. 4 partner types, up to 20% revenue share, free to join.">
    <meta name="twitter:image" content="https://edunodex.in/images/og-image.jpg">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/favicon.png">
    <link rel="apple-touch-icon" href="images/favicon.png">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Flowbite Components -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css" rel="stylesheet" />

    <!-- Custom Config -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
                    }
                },
                fontFamily: {
                    'body': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                    'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
                }
            }
        }
    </script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GT-MKBHFCK6"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-9B2DLLXH62');
        gtag('config', 'AW-18055680778');
    </script>

    <!-- FAQ Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who can become an EdunodeX partner?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Anyone with connections to schools — consultants, IT vendors, education professionals, or even school parents."
          }
        },
        {
          "@type": "Question",
          "name": "Is there any fee to join the EdunodeX partner program?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The partner program is completely free to join."
          }
        },
        {
          "@type": "Question",
          "name": "How are partner commissions paid?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Monthly bank transfer. Minimum payout is ₹1,000."
          }
        },
        {
          "@type": "Question",
          "name": "Can I combine partner types?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — you can be a Referral + Implementation partner and earn from both."
          }
        },
        {
          "@type": "Question",
          "name": "What support do EdunodeX partners get?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Marketing kit, product training, dedicated partner manager, and priority support for your referred schools."
          }
        },
        {
          "@type": "Question",
          "name": "How do I track my referrals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We share a live tracking sheet with you. A partner dashboard is coming soon."
          }
        }
      ]
    }
    </script>

    <style>
        .partner-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .partner-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -8px rgba(102, 126, 234, 0.25);
        }
        .step-connector {
            position: relative;
        }
        .step-connector::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -2rem;
            width: 2rem;
            height: 2px;
            background: linear-gradient(90deg, #667eea, #764ba2);
        }
        @media (max-width: 768px) {
            .step-connector::after {
                display: none;
            }
        }
    </style>
</head>
<body class="font-sans antialiased">
```

- [ ] **Step 2: Add navbar (copied from index.html with Partners link added)**

Add immediately after `<body>`:

```html
    <!-- Navigation -->
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 fixed w-full z-50 top-0 shadow-sm">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" class="flex items-center">
                <img src="images/favicon.png" alt="EdunodeX Logo" class="h-10 mr-3" loading="lazy">
                <span class="self-center text-xl font-bold whitespace-nowrap bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">EdunodeX</span>
            </a>
            <div class="flex items-center lg:order-2 space-x-2">
                <a href="GOOGLE_FORM_URL" target="_blank" rel="noopener" class="text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-3 sm:px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none inline-flex items-center shadow-lg whitespace-nowrap" onclick="gtag('event', 'click', {'event_category': 'Partner CTA', 'event_label': 'Nav Apply Now'});">
                    Apply Now
                </a>
                <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="mobile-menu-2" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li><a href="/#features" class="block py-3 pr-4 pl-3 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Features</a></li>
                    <li><a href="/#pricing" class="block py-3 pr-4 pl-3 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Pricing</a></li>
                    <li><a href="/partners.html" class="block py-3 pr-4 pl-3 text-purple-700 font-semibold lg:p-0">Partners</a></li>
                    <li><a href="/#contact" class="block py-3 pr-4 pl-3 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Contact</a></li>
                    <li><a href="/blog/" class="block py-3 pr-4 pl-3 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Blog</a></li>
                </ul>
            </div>
        </div>
    </nav>
```

- [ ] **Step 3: Add hero section**

Add after the nav:

```html
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 pt-24">
        <div class="max-w-screen-xl px-4 py-16 mx-auto text-center lg:py-24">
            <div class="inline-flex items-center px-4 py-1.5 mb-6 text-sm font-semibold text-purple-200 bg-white/10 rounded-full backdrop-blur-sm">
                Partner Program
            </div>
            <h1 class="max-w-3xl mx-auto mb-6 text-4xl font-extrabold tracking-tight leading-tight text-white md:text-5xl xl:text-6xl">
                Grow With EdunodeX —<br>
                <span class="text-purple-200">Become a Partner</span>
            </h1>
            <p class="max-w-2xl mx-auto mb-10 text-lg font-light text-purple-100 lg:text-xl">
                Help schools across India modernize with AI-powered management. Earn recurring income while transforming education.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="GOOGLE_FORM_URL" target="_blank" rel="noopener" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-purple-700 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-purple-300 shadow-lg transition-all" onclick="gtag('event', 'click', {'event_category': 'Partner CTA', 'event_label': 'Hero Apply Now'});">
                    Apply Now
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </a>
                <a href="#why-partner" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all">
                    Learn More
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                </a>
            </div>
        </div>
    </section>
```

- [ ] **Step 4: Open in browser and verify hero renders**

Open `partners.html` in a browser. Verify: gradient background, headline, two CTAs, navbar with "Partners" highlighted.

- [ ] **Step 5: Commit**

```bash
git add partners.html
git commit -m "feat(partners): create partners.html with head, nav, and hero section"
```

---

### Task 2: Add "Why Partner" and "Partner Types" sections

**Files:**
- Modify: `partners.html`

- [ ] **Step 1: Add "Why Partner with EdunodeX" section**

Add after the hero section closing `</section>`:

```html
    <!-- Why Partner Section -->
    <section id="why-partner" class="bg-gray-50 py-16 lg:py-24">
        <div class="max-w-screen-xl px-4 mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl">Why Partner with EdunodeX?</h2>
                <p class="mt-4 text-lg text-gray-500">India's school digitization market is booming. Be part of it.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white rounded-xl p-6 text-center shadow-sm partner-card">
                    <div class="text-4xl mb-4">📈</div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Growing Market</h3>
                    <p class="text-sm text-gray-500">3L+ schools in India are digitizing. Massive untapped opportunity in tier 2/3 cities.</p>
                </div>
                <div class="bg-white rounded-xl p-6 text-center shadow-sm partner-card">
                    <div class="text-4xl mb-4">💰</div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Recurring Income</h3>
                    <p class="text-sm text-gray-500">Earn every month, not just once. Revenue share means your income grows with your network.</p>
                </div>
                <div class="bg-white rounded-xl p-6 text-center shadow-sm partner-card">
                    <div class="text-4xl mb-4">🎯</div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Easy to Sell</h3>
                    <p class="text-sm text-gray-500">At ₹10/student/month, schools say yes fast. No long sales cycles or budget battles.</p>
                </div>
                <div class="bg-white rounded-xl p-6 text-center shadow-sm partner-card">
                    <div class="text-4xl mb-4">🤝</div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Full Support</h3>
                    <p class="text-sm text-gray-500">Training, marketing kit, dedicated partner manager — we set you up for success.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: Add "Partner Types" section**

Add after the Why Partner section:

```html
    <!-- Partner Types Section -->
    <section id="partner-types" class="py-16 lg:py-24">
        <div class="max-w-screen-xl px-4 mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl">Choose Your Partner Type</h2>
                <p class="mt-4 text-lg text-gray-500">Pick the model that fits you best — or combine them</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

                <!-- Referral Partner -->
                <div class="partner-card rounded-xl p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-3xl">🔗</span>
                        <h3 class="text-xl font-bold text-gray-900">Referral Partner</h3>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">School consultants, retired principals, education influencers, parents with school connections</p>
                    <div class="bg-white rounded-lg p-4 mb-4 border border-purple-100">
                        <p class="text-sm font-semibold text-gray-900">What you do:</p>
                        <p class="text-sm text-gray-500 mt-1">Recommend EdunodeX to schools. We handle demo, onboarding, and support.</p>
                    </div>
                    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4">
                        <p class="text-sm font-bold">₹3,000 signup bonus + 15% revenue share for 12 months</p>
                        <p class="text-xs mt-1 text-purple-200">500-student school = ₹12,000/year</p>
                    </div>
                </div>

                <!-- Reseller Partner -->
                <div class="partner-card rounded-xl p-6 border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-white relative">
                    <div class="absolute -top-3 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-3xl">🏪</span>
                        <h3 class="text-xl font-bold text-gray-900">Reseller Partner</h3>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">Local IT vendors, education distributors, school supply businesses in tier 2/3 cities</p>
                    <div class="bg-white rounded-lg p-4 mb-4 border border-purple-100">
                        <p class="text-sm font-semibold text-gray-900">What you do:</p>
                        <p class="text-sm text-gray-500 mt-1">Actively sell, demo, onboard, and provide first-line support to schools.</p>
                    </div>
                    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4">
                        <p class="text-sm font-bold">₹5,000 signup bonus + 20% revenue share for 24 months</p>
                        <p class="text-xs mt-1 text-purple-200">500-student school = ₹29,000 over 2 years</p>
                    </div>
                </div>

                <!-- Implementation Partner -->
                <div class="partner-card rounded-xl p-6 border border-gray-200 bg-white">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-3xl">⚙️</span>
                        <h3 class="text-xl font-bold text-gray-900">Implementation Partner</h3>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">Freelancers, IT consultants, agencies experienced in school software setup</p>
                    <div class="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                        <p class="text-sm font-semibold text-gray-900">What you do:</p>
                        <p class="text-sm text-gray-500 mt-1">Handle data migration, configuration, and staff training for schools.</p>
                    </div>
                    <div class="bg-gray-900 text-white rounded-lg p-4">
                        <p class="text-sm font-bold">Charge schools ₹10K–₹25K directly</p>
                        <p class="text-xs mt-1 text-gray-400">EdunodeX takes no cut — 100% yours</p>
                    </div>
                </div>

                <!-- Integration Partner -->
                <div class="partner-card rounded-xl p-6 border border-gray-200 bg-white">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-3xl">🔌</span>
                        <h3 class="text-xl font-bold text-gray-900">Integration Partner</h3>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">Biometric/CCTV vendors, payment gateways, SMS providers, ed-tech platforms</p>
                    <div class="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                        <p class="text-sm font-semibold text-gray-900">What you do:</p>
                        <p class="text-sm text-gray-500 mt-1">Integrate your product with EdunodeX for mutual customers.</p>
                    </div>
                    <div class="bg-gray-900 text-white rounded-lg p-4">
                        <p class="text-sm font-bold">Co-marketing + API access</p>
                        <p class="text-xs mt-1 text-gray-400">Mutual benefit — joint sales opportunities</p>
                    </div>
                </div>

            </div>
        </div>
    </section>
```

- [ ] **Step 3: Verify in browser**

Open `partners.html`. Scroll past hero. Verify: 4 value prop cards render horizontally on desktop (stacked on mobile), 4 partner type cards in 2×2 grid with "MOST POPULAR" badge on Reseller, hover animations work.

- [ ] **Step 4: Commit**

```bash
git add partners.html
git commit -m "feat(partners): add why-partner and partner-types sections"
```

---

### Task 3: Add commission table and "How It Works" sections

**Files:**
- Modify: `partners.html`

- [ ] **Step 1: Add commission structure table**

Add after the Partner Types section:

```html
    <!-- Commission Structure -->
    <section class="bg-gray-50 py-16 lg:py-24">
        <div class="max-w-screen-xl px-4 mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl">What You Can Earn</h2>
                <p class="mt-4 text-lg text-gray-500">Real numbers, no inflated claims</p>
            </div>
            <div class="max-w-3xl mx-auto overflow-x-auto">
                <table class="w-full text-sm text-left border-collapse rounded-xl overflow-hidden shadow-sm">
                    <thead>
                        <tr class="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                            <th class="px-6 py-4 font-semibold">School Size</th>
                            <th class="px-6 py-4 font-semibold text-center">Referral Earnings/yr</th>
                            <th class="px-6 py-4 font-semibold text-center">Reseller Earnings/2yr</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr class="border-b border-gray-100">
                            <td class="px-6 py-4 font-medium text-gray-900">200 students</td>
                            <td class="px-6 py-4 text-center text-gray-700">₹6,600</td>
                            <td class="px-6 py-4 text-center text-gray-700">₹14,600</td>
                        </tr>
                        <tr class="border-b border-gray-100 bg-gray-50">
                            <td class="px-6 py-4 font-medium text-gray-900">500 students</td>
                            <td class="px-6 py-4 text-center text-gray-700">₹12,000</td>
                            <td class="px-6 py-4 text-center text-gray-700">₹29,000</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                            <td class="px-6 py-4 font-medium text-gray-900">1,000 students</td>
                            <td class="px-6 py-4 text-center text-gray-700">₹21,000</td>
                            <td class="px-6 py-4 text-center text-gray-700">₹53,000</td>
                        </tr>
                        <tr class="bg-gradient-to-r from-purple-50 to-blue-50">
                            <td class="px-6 py-4 font-bold text-gray-900">5 schools (500 avg)</td>
                            <td class="px-6 py-4 text-center font-bold text-purple-700">₹60,000</td>
                            <td class="px-6 py-4 text-center font-bold text-purple-700">₹1,45,000</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-center text-sm text-gray-400 mt-4">Payouts processed monthly via bank transfer. Minimum payout: ₹1,000.</p>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: Add "How It Works" section**

Add after the commission section:

```html
    <!-- How It Works -->
    <section class="py-16 lg:py-24">
        <div class="max-w-screen-xl px-4 mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl">How It Works</h2>
                <p class="mt-4 text-lg text-gray-500">Three simple steps to start earning</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div class="text-center step-connector">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">1</div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Apply</h3>
                    <p class="text-sm text-gray-500">Fill out the partner application form. Takes just 2 minutes.</p>
                </div>
                <div class="text-center step-connector">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">2</div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Get Approved</h3>
                    <p class="text-sm text-gray-500">Our team connects within 48 hours with training and marketing materials.</p>
                </div>
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">3</div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Start Earning</h3>
                    <p class="text-sm text-gray-500">Share EdunodeX with schools, track your referrals, and earn commissions every month.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 3: Verify in browser**

Check commission table renders with gradient header, alternating row colors, bold bottom row. Check 3-step flow with numbered circles and connector lines on desktop.

- [ ] **Step 4: Commit**

```bash
git add partners.html
git commit -m "feat(partners): add commission table and how-it-works sections"
```

---

### Task 4: Add benefits, coverage, FAQ, and final CTA sections

**Files:**
- Modify: `partners.html`

- [ ] **Step 1: Add partner benefits section**

Add after the How It Works section:

```html
    <!-- Partner Benefits -->
    <section class="bg-gray-50 py-16 lg:py-24">
        <div class="max-w-screen-xl px-4 mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl">Partner Benefits</h2>
                <p class="mt-4 text-lg text-gray-500">Everything you need to succeed</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div class="bg-white rounded-xl p-6 shadow-sm partner-card">
                    <div class="text-3xl mb-3">🎓</div>
                    <h3 class="text-base font-bold text-gray-900 mb-2">Training & Onboarding</h3>
                    <p class="text-sm text-gray-500">Product walkthrough and sales pitch training via video call</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm partner-card">
                    <div class="text-3xl mb-3">📦</div>
                    <h3 class="text-base font-bold text-gray-900 mb-2">Marketing Kit</h3>
                    <p class="text-sm text-gray-500">Brochures, demo videos, presentation decks in Hindi & English</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm partner-card">
                    <div class="text-3xl mb-3">👤</div>
                    <h3 class="text-base font-bold text-gray-900 mb-2">Dedicated Partner Manager</h3>
                    <p class="text-sm text-gray-500">Single point of contact for support and escalations</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm partner-card">
                    <div class="text-3xl mb-3">⚡</div>
                    <h3 class="text-base font-bold text-gray-900 mb-2">Priority Support</h3>
                    <p class="text-sm text-gray-500">Fast-track support for your referred schools</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm partner-card">
                    <div class="text-3xl mb-3">📊</div>
                    <h3 class="text-base font-bold text-gray-900 mb-2">Real-Time Tracking</h3>
                    <p class="text-sm text-gray-500">Track your referrals and commissions via live shared sheet</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm partner-card">
                    <div class="text-3xl mb-3">🎉</div>
                    <h3 class="text-base font-bold text-gray-900 mb-2">Exclusive Events</h3>
                    <p class="text-sm text-gray-500">Quarterly partner meetups and early access to new features</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: Add coverage section**

```html
    <!-- Coverage -->
    <section class="py-16 lg:py-24">
        <div class="max-w-screen-xl px-4 mx-auto text-center">
            <h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl mb-4">Pan-India Partner Network</h2>
            <p class="text-lg text-gray-500 mb-8">Priority regions highlighted — but we welcome partners from across India</p>
            <div class="flex flex-wrap gap-3 justify-center mb-4">
                <span class="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm">Bihar</span>
                <span class="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm">Madhya Pradesh</span>
                <span class="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm">Uttar Pradesh</span>
                <span class="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm">Jharkhand</span>
                <span class="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm">Rajasthan</span>
                <span class="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm">Chhattisgarh</span>
            </div>
            <p class="text-sm text-gray-400">+ All other states welcome</p>
        </div>
    </section>
```

- [ ] **Step 3: Add FAQ section**

```html
    <!-- FAQ -->
    <section class="bg-gray-50 py-16 lg:py-24">
        <div class="max-w-screen-xl px-4 mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl">Frequently Asked Questions</h2>
            </div>
            <div class="max-w-2xl mx-auto space-y-4">
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="text-base font-bold text-gray-900 mb-2">Who can become a partner?</h3>
                    <p class="text-sm text-gray-500">Anyone with connections to schools — consultants, IT vendors, education professionals, or even school parents.</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="text-base font-bold text-gray-900 mb-2">Is there any fee to join?</h3>
                    <p class="text-sm text-gray-500">No. The partner program is completely free to join.</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="text-base font-bold text-gray-900 mb-2">How are commissions paid?</h3>
                    <p class="text-sm text-gray-500">Monthly bank transfer. Minimum payout ₹1,000.</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="text-base font-bold text-gray-900 mb-2">Can I combine partner types?</h3>
                    <p class="text-sm text-gray-500">Yes — you can be a Referral + Implementation partner and earn from both.</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="text-base font-bold text-gray-900 mb-2">What support do I get?</h3>
                    <p class="text-sm text-gray-500">Marketing kit, product training, dedicated partner manager, and priority support for your referred schools.</p>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="text-base font-bold text-gray-900 mb-2">How do I track my referrals?</h3>
                    <p class="text-sm text-gray-500">We share a live tracking sheet with you. A partner dashboard is coming soon.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 4: Add final CTA section**

```html
    <!-- Final CTA -->
    <section class="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 py-16 lg:py-24">
        <div class="max-w-screen-xl px-4 mx-auto text-center">
            <h2 class="text-3xl font-extrabold text-white md:text-4xl mb-4">Ready to Grow With Us?</h2>
            <p class="text-lg text-purple-100 mb-10 max-w-xl mx-auto">Join India's fastest-growing school OS partner network. Apply in 2 minutes.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="GOOGLE_FORM_URL" target="_blank" rel="noopener" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-purple-700 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-purple-300 shadow-lg transition-all" onclick="gtag('event', 'click', {'event_category': 'Partner CTA', 'event_label': 'Footer Apply Now'});">
                    Apply Now
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </a>
                <a href="https://wa.me/917880170555?text=Hi%2C%20I%27m%20interested%20in%20the%20EdunodeX%20Partner%20Program" target="_blank" rel="noopener" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all" onclick="gtag('event', 'click', {'event_category': 'Partner CTA', 'event_label': 'Footer WhatsApp'});">
                    💬 Talk to Us
                </a>
            </div>
        </div>
    </section>
```

- [ ] **Step 5: Verify all new sections in browser**

Scroll through the full page. Verify: benefits grid (3 cols desktop, 1 col mobile), state pills, FAQ cards, final CTA with two buttons.

- [ ] **Step 6: Commit**

```bash
git add partners.html
git commit -m "feat(partners): add benefits, coverage, FAQ, and final CTA sections"
```

---

### Task 5: Add footer and closing HTML

**Files:**
- Modify: `partners.html`

- [ ] **Step 1: Add footer (matching index.html) and closing tags**

Add after the final CTA section:

```html
    <!-- Footer -->
    <footer class="p-4 bg-white md:p-8 lg:p-10">
        <div class="mx-auto max-w-screen-xl text-center">
            <a href="/" class="flex justify-center items-center text-2xl font-semibold text-gray-900 mb-4">
                <img src="images/favicon.png" alt="EdunodeX Logo" class="h-12 mr-3" loading="lazy">
                <span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">EdunodeX</span>
            </a>
            <p class="my-6 text-gray-500">India's School OS &mdash; Powered by EdunodeX AI<br>25+ Modules. Multilingual. WhatsApp-First. ₹10/student/month.</p>
            <ul class="flex flex-wrap justify-center items-center mb-6 text-gray-900">
                <li><a href="/#features" class="mr-4 hover:underline md:mr-6">Features</a></li>
                <li><a href="/#pricing" class="mr-4 hover:underline md:mr-6">Pricing</a></li>
                <li><a href="/partners.html" class="mr-4 hover:underline md:mr-6 text-purple-700 font-semibold">Partners</a></li>
                <li><a href="/#contact" class="mr-4 hover:underline md:mr-6">Contact</a></li>
                <li><a href="/blog/" class="mr-4 hover:underline md:mr-6">Blog</a></li>
                <li><a href="mailto:hello@xentovia.ai" class="mr-4 hover:underline md:mr-6">Email</a></li>
                <li><a href="/privacy-policy" class="mr-4 hover:underline md:mr-6">Privacy Policy</a></li>
                <li><a href="/terms-of-service" class="mr-4 hover:underline md:mr-6">Terms of Service</a></li>
            </ul>
            <span class="text-sm text-gray-500 sm:text-center">&copy; 2026 Xentovia Tech Pvt Ltd. All rights reserved.</span>
        </div>
    </footer>

    <!-- Flowbite JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify full page renders end to end**

Open `partners.html` in browser. Scroll from hero to footer. Verify footer matches main site, all links work, mobile hamburger menu works.

- [ ] **Step 3: Commit**

```bash
git add partners.html
git commit -m "feat(partners): add footer and complete page structure"
```

---

### Task 6: Update index.html nav, footer, and sitemap

**Files:**
- Modify: `index.html:250-256` (nav)
- Modify: `index.html:1591-1598` (footer)
- Modify: `sitemap.xml`

- [ ] **Step 1: Add "Partners" link to main site navbar**

In `index.html`, find the nav `<ul>` (around line 250). Add the Partners link between Pricing and Contact:

```html
<!-- Find this line: -->
                    <li><a href="#pricing" class="block py-3 pr-4 pl-3 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Pricing</a></li>

<!-- Add after it: -->
                    <li><a href="/partners.html" class="block py-3 pr-4 pl-3 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Partners</a></li>
```

- [ ] **Step 2: Add "Partners" link to main site footer**

In `index.html`, find the footer `<ul>` (around line 1591). Add Partners link after Pricing:

```html
<!-- Find this line: -->
                <li><a href="#pricing" class="mr-4 hover:underline md:mr-6">Pricing</a></li>

<!-- Add after it: -->
                <li><a href="/partners.html" class="mr-4 hover:underline md:mr-6">Partners</a></li>
```

- [ ] **Step 3: Add partners page to sitemap.xml**

Add before the `</urlset>` closing tag:

```xml
  <url>
    <loc>https://edunodex.in/partners</loc>
    <lastmod>2026-04-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
```

- [ ] **Step 4: Verify main site nav and footer show Partners link**

Open `index.html` in browser. Verify "Partners" appears in navbar between Pricing and Contact. Verify it appears in footer. Click the link — should navigate to `partners.html`.

- [ ] **Step 5: Commit**

```bash
git add index.html sitemap.xml
git commit -m "feat(partners): add Partners link to main nav, footer, and sitemap"
```

---

### Task 7: Replace GOOGLE_FORM_URL placeholders and final verification

**Files:**
- Modify: `partners.html`

- [ ] **Step 1: Create the Google Form**

Create a Google Form with these fields:
- Full Name (Short answer, required)
- Phone Number (Short answer, required)
- Email Address (Short answer, required)
- City / State (Short answer, required)
- Partner Type (Dropdown: Referral Partner / Reseller Partner / Implementation Partner / Integration Partner, required)
- Number of schools you currently work with (Short answer)
- How did you hear about EdunodeX? (Short answer)

Copy the form's shareable link.

- [ ] **Step 2: Replace all GOOGLE_FORM_URL placeholders**

In `partners.html`, find all 3 instances of `GOOGLE_FORM_URL` and replace with the actual Google Form URL. There are 3 occurrences:
1. Nav "Apply Now" button (line ~in nav section)
2. Hero "Apply Now" button (line ~in hero section)
3. Final CTA "Apply Now" button (line ~in final CTA section)

- [ ] **Step 3: Full page verification**

Test the complete page:
- [ ] Desktop: Hero renders with gradient, both CTAs work
- [ ] Desktop: All 10 sections visible and properly spaced
- [ ] Desktop: Nav links work (Features/Pricing scroll to main page sections)
- [ ] Desktop: "Apply Now" opens Google Form in new tab
- [ ] Desktop: WhatsApp "Talk to Us" opens WhatsApp with pre-filled message
- [ ] Mobile: Hamburger menu works, all links accessible
- [ ] Mobile: Partner type cards stack vertically
- [ ] Mobile: Commission table scrolls horizontally
- [ ] Mobile: Step connectors hidden
- [ ] View page source: FAQ structured data present and valid

- [ ] **Step 4: Commit**

```bash
git add partners.html
git commit -m "feat(partners): add Google Form URL and finalize page"
```
