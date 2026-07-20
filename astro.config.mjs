// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// City landing-page slugs use the natural short form (e.g. "verden"). These
// pairs map the earlier verbose slug to the new short one so any existing link
// keeps working. Keep in sync with citySlugAliases in src/data/cities.ts.
const lpTypes = [
  'buerocontainer',
  'lagercontainer',
  'sanitaercontainer',
  'containeranlagen',
  'wohncontainer',
];
const citySlugAliases = [
  ['rotenburg-wuemme', 'rotenburg'],
  ['verden-aller', 'verden'],
  ['lohne-oldenburg', 'lohne'],
  ['werther-westfalen', 'werther'],
  ['haren-ems', 'haren'],
  ['lingen-ems', 'lingen'],
  ['gronau-westfalen', 'gronau'],
];
const citySlugRedirects = Object.fromEntries(
  citySlugAliases.flatMap(([from, to]) =>
    lpTypes.map((t) => [`/lp/${t}-kaufen-${from}`, `/lp/${t}-kaufen-${to}`]),
  ),
);

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
    ...citySlugRedirects,
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
