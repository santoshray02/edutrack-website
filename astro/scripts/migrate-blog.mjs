// One-shot migration of blog HTML articles into Astro wrappers.
// Run: bun astro/scripts/migrate-blog.mjs  (from repo root)

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const repoRoot = resolve(__dirname, '../..');
const blogSrcDir = join(repoRoot, 'blog');
const rawDir = join(repoRoot, 'astro/src/raw');
const pagesBlogDir = join(repoRoot, 'astro/src/pages/blog');

mkdirSync(rawDir, { recursive: true });
mkdirSync(pagesBlogDir, { recursive: true });

const slugs = readdirSync(blogSrcDir).filter((n) => {
  const full = join(blogSrcDir, n);
  return statSync(full).isDirectory() && existsSync(join(full, 'index.html'));
});

function matchOne(source, re) {
  const m = source.match(re);
  return m ? m[1] : '';
}

function safeProp(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function extractJsonLdBlocks(source) {
  const matches = [...source.matchAll(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi)];
  return matches.map((m) => m[0]).join('\n');
}

function normalizePaths(html) {
  return html
    .replace(/src="\.\.\/\.\.\/images\//g, 'src="/images/')
    .replace(/href="\.\.\/\.\.\/images\//g, 'href="/images/')
    .replace(/src="\.\.\/images\//g, 'src="/images/')
    .replace(/href="\.\.\/images\//g, 'href="/images/')
    .replace(/src="\.\.\/\.\.\/js\//g, 'src="/js/')
    .replace(/src="\.\.\/js\//g, 'src="/js/')
    .replace(/href="\.\.\/\.\.\/blog\/"/g, 'href="/blog/"')
    .replace(/href="\.\.\/\.\.\/"/g, 'href="/"')
    .replace(/href="\.\.\/"/g, 'href="/blog/"')
    .replace(/href="\.\.\/\.\.\/partners\.html"/g, 'href="/partners.html"')
    .replace(/href="\.\.\/\.\.\/privacy-policy"/g, 'href="/privacy-policy"')
    .replace(/href="\.\.\/\.\.\/terms-of-service"/g, 'href="/terms-of-service"')
    .replace(/href="\.\.\/\.\.\/#/g, 'href="/#');
}

function dropDuplicatedScripts(html) {
  return html
    .replace(/\s*<!--\s*Flowbite\s*JS\s*-->\s*<script\s+src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/flowbite\/[^>]*>\s*<\/script>\s*/gi, '\n')
    .replace(/<script\s+src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/flowbite\/2\.2\.1\/flowbite\.min\.js"[^>]*>\s*<\/script>/gi, '')
    .replace(/\s*<!--[^-]*AI Sales Chat[^-]*-->\s*<script\s+src="(?:\.\.\/)*js\/sales-chat\.js"[^>]*>\s*<\/script>\s*/gi, '\n')
    .replace(/<script\s+src="(?:\.\.\/)*js\/sales-chat\.js"[^>]*>\s*<\/script>/gi, '');
}

const report = [];

for (const slug of slugs) {
  const srcFile = join(blogSrcDir, slug, 'index.html');
  const src = readFileSync(srcFile, 'utf-8');

  const title = matchOne(src, /<title>([^<]*)<\/title>/);
  const description = matchOne(src, /<meta\s+name="description"\s+content="([^"]*)"/);
  const keywords = matchOne(src, /<meta\s+name="keywords"\s+content="([^"]*)"/);
  const canonical = matchOne(src, /<link\s+rel="canonical"\s+href="([^"]+)"/) || `https://edunodex.in/blog/${slug}/`;
  const ogTitle = matchOne(src, /<meta\s+property="og:title"\s+content="([^"]*)"/) || title;
  const ogDescription = matchOne(src, /<meta\s+property="og:description"\s+content="([^"]*)"/) || description;
  const ogImage = matchOne(src, /<meta\s+property="og:image"\s+content="([^"]*)"/) || 'https://edunodex.in/images/og-image.jpg';
  const twitterTitle = matchOne(src, /<meta\s+name="twitter:title"\s+content="([^"]*)"/) || ogTitle;
  const twitterDescription = matchOne(src, /<meta\s+name="twitter:description"\s+content="([^"]*)"/) || ogDescription;
  const twitterImage = matchOne(src, /<meta\s+name="twitter:image"\s+content="([^"]*)"/) || ogImage;

  const bodyMatch = src.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    console.error('! No body in', slug);
    continue;
  }
  let body = bodyMatch[1];
  body = normalizePaths(body);
  body = dropDuplicatedScripts(body);

  const jsonLd = extractJsonLdBlocks(src);

  const bodyFile = `blog-${slug}-body.html`;
  const headFile = `blog-${slug}-head.html`;
  writeFileSync(join(rawDir, bodyFile), body);
  writeFileSync(join(rawDir, headFile), jsonLd);

  const pageDir = join(pagesBlogDir, slug);
  mkdirSync(pageDir, { recursive: true });
  const astro = `---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import bodyHtml from '../../../raw/${bodyFile}?raw';
import headHtml from '../../../raw/${headFile}?raw';
---
<BaseLayout
  title="${safeProp(title)}"
  description="${safeProp(description)}"
  keywords="${safeProp(keywords)}"
  canonical="${safeProp(canonical)}"
  ogType="article"
  ogTitle="${safeProp(ogTitle)}"
  ogDescription="${safeProp(ogDescription)}"
  ogImage="${safeProp(ogImage)}"
  twitterTitle="${safeProp(twitterTitle)}"
  twitterDescription="${safeProp(twitterDescription)}"
  twitterImage="${safeProp(twitterImage)}"
  bodyClass="bg-white font-sans antialiased"
  includeFlowbite={true}
  includeSalesChat={false}
>
  <Fragment slot="head" set:html={headHtml} />
  <Fragment set:html={bodyHtml} />
</BaseLayout>
`;
  writeFileSync(join(pageDir, 'index.astro'), astro);

  report.push({ slug, title, canonical, bytes: body.length });
}

console.log(`Migrated ${report.length} blog articles:`);
for (const r of report) {
  console.log(`  ${r.slug.padEnd(45)} ${r.bytes.toString().padStart(7)}B`);
}
