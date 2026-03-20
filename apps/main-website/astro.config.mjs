// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  adapter: cloudflare(),
  site: 'https://dezkareid.dev',
  integrations: [sitemap()],
});
