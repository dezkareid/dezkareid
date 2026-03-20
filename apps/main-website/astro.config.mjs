// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    // TODO: change this to 'compile' when we have more than 2 images
    imageService: 'passthrough',
  }),
  site: 'https://dezkareid.dev',
  integrations: [sitemap()],
});
