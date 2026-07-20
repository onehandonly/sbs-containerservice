import type { City } from '../data/cities';

const SITE = 'https://anfrage.sbs-container.de';

export interface LpBase {
  /** Product noun as it appears before "kaufen", e.g. "Lagercontainer" */
  product: string;
  /** GTM/Ads label base, e.g. "lp_lagercontainer" */
  gtmBase: string;
  /** Canonical path of the generic (non-city) page, e.g. "/lp/lagercontainer-kaufen" */
  canonicalPath: string;
  /** Title tail after "{product} kaufen[ in {city}] – ", incl. brand suffix */
  titleSuffix: string;
  /** Headline tail after "{product} kaufen[ in {city}] – " */
  headlineSuffix: string;
  /** Hero subline for the generic page */
  subline: string;
  /** Meta description used verbatim on the generic page */
  descriptionBase: string;
}

export interface LpCopy {
  title: string;
  description: string;
  canonical: string;
  headline: string;
  subline: string;
  gtmLabel: string;
  /** City name when this is a city variant, otherwise null */
  cityName: string | null;
}

/**
 * Builds the SEO/tracking copy for a landing page. Without a city the output
 * reproduces the original generic page verbatim; with a city it injects the
 * city name into title, headline, subline, canonical and gtmLabel.
 */
export function lpCopy(base: LpBase, city?: City | null): LpCopy {
  if (!city) {
    return {
      title: `${base.product} kaufen – ${base.titleSuffix}`,
      description: base.descriptionBase,
      canonical: `${SITE}${base.canonicalPath}`,
      headline: `${base.product} kaufen – ${base.headlineSuffix}`,
      subline: base.subline,
      gtmLabel: base.gtmBase,
      cityName: null,
    };
  }

  const c = city.name;
  return {
    title: `${base.product} kaufen in ${c} – ${base.titleSuffix}`,
    description: `${base.product} kaufen in ${c}: Festpreis, schnelle Lieferung in ${c} und Umgebung. Jetzt kostenloses Angebot anfragen!`,
    canonical: `${SITE}${base.canonicalPath}-${city.slug}`,
    headline: `${base.product} kaufen in ${c} – ${base.headlineSuffix}`,
    subline: `${base.subline} Lieferung nach ${c} und in die gesamte Region.`,
    gtmLabel: `${base.gtmBase}_${city.slug.replace(/-/g, '_')}`,
    cityName: c,
  };
}
