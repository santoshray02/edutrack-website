import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://edunodex.in',
  trailingSlash: 'ignore',
  build: {
    format: 'preserve',
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
});
