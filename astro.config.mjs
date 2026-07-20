// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://anfrage.sbs-container.de',
  base: '/',
  output: 'static',
  // Safety net for mistyped / wrong-path landing-page URLs (e.g. from Ads final
  // URLs) so clicks land on the correct page instead of a 404.
  redirects: {
    '/buerocontainer-kaufen': '/lp/buerocontainer-kaufen',
    '/buerorcontainer-kaufen': '/lp/buerocontainer-kaufen',
    '/lp/buerorcontainer-kaufen': '/lp/buerocontainer-kaufen',
    '/sanitaercontainer-kaufen': '/lp/sanitaercontainer-kaufen',
    '/lagercontainer-kaufen': '/lp/lagercontainer-kaufen',
    '/containeranlagen-kaufen': '/lp/containeranlagen-kaufen',
    '/wohncontainer-kaufen': '/lp/wohncontainer-kaufen',
  },
  integrations: [
    sitemap({
      // Include the indexable city landing pages; keep the generic Ads LPs,
      // the wohncontainer redirects and the thank-you page out of the sitemap.
      filter: (page) => {
        if (page.includes('/danke')) return false;
        // City content pages: /lp/<type>-kaufen-<city>
        if (/\/lp\/(buerocontainer|lagercontainer|sanitaercontainer|containeranlagen)-kaufen-[^/]+\/?$/.test(page)) {
          return true;
        }
        // Everything else under /lp/ (generic base LPs, wohncontainer redirects)
        if (page.includes('/lp/')) return false;
        return true;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
