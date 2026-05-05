// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://anfrage.sbs-container.de',
  base: '/',
  output: 'static',
  integrations: [
    sitemap({
      // Exclude landing pages (Ads traffic only, not organic) and thank-you page
      filter: (page) => !page.includes('/lp/') && !page.includes('/danke'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
