/**
 * Site-wide SEO defaults aligned with the German market
 * (Nuremberg / Nuremberg Metropolitan Region).
 */

export const SITE_NAME = 'Hausverwaltung WERT';
export const BASE_URL = 'https://www.hausverwaltungwert.de';
export const OG_IMAGE = `${BASE_URL}/images/logo.png`;

/** Primary homepage metadata (title / description / OG / Twitter). */
export const HOME_SEO = {
  title:
    'Property Management Nuremberg | HOA, Residential & Commercial Management | Hausverwaltung WERT',
  description:
    'Professional property management for HOAs, residential rentals, and commercial properties in Nuremberg and the surrounding area. Hausverwaltung WERT stands for personalized service, transparent communication, and reliable management.',
};

/**
 * German-market page metadata — used by generateMetadata only.
 * Kept separate from UI translations so visible copy is unchanged.
 */
export const PAGE_SEO = {
  services: {
    title: `Hausverwaltung Leistungen Nürnberg | WEG, Miet- & Gewerbeverwaltung | ${SITE_NAME}`,
    description:
      'Professionelle Hausverwaltung in Nürnberg und der Metropolregion: WEG-Verwaltung, Sondereigentum, Mietverwaltung und Gewerbeverwaltung — persönlich, transparent und zuverlässig.',
  },
  objects: {
    title: `Verwaltete Objekte Nürnberg | Wohn- & Gewerbeimmobilien | ${SITE_NAME}`,
    description:
      'Einblick in Wohn- und Gewerbeimmobilien unter Verwaltung von Hausverwaltung WERT in Nürnberg und der Metropolregion Nürnberg.',
  },
  contact: {
    title: `Kontakt Hausverwaltung Nürnberg | ${SITE_NAME}`,
    description:
      'Kontaktieren Sie Hausverwaltung WERT in Zirndorf bei Nürnberg — persönliche Beratung zu WEG-, Miet- und Gewerbeverwaltung in der Metropolregion.',
  },
  impressum: {
    title: `Impressum | ${SITE_NAME}`,
    description: 'Impressum und rechtliche Informationen von Hausverwaltung WERT, Zirndorf / Nürnberg.',
  },
  datenschutz: {
    title: `Datenschutzerklärung | ${SITE_NAME}`,
    description:
      'Datenschutzerklärung von Hausverwaltung WERT – Informationen zum Schutz Ihrer personenbezogenen Daten.',
  },
  objectDetail: {
    title: `Objektdetails | ${SITE_NAME}`,
    description:
      'Details zu einem von Hausverwaltung WERT verwalteten Objekt in Nürnberg und Umgebung.',
  },
  locations: {
    title: `Standorte & Servicegebiet | Hausverwaltung Metropolregion Nürnberg | ${SITE_NAME}`,
    description:
      'Hausverwaltung WERT betreut Immobilien in Nürnberg und der gesamten Metropolregion — inkl. Fürth, Erlangen, Schwabach, Zirndorf und Umgebung.',
  },
};

/** Cities / regions served — for LocalBusiness areaServed & local SEO. */
export const SERVICE_AREA = [
  'Nürnberg',
  'Fürth',
  'Erlangen',
  'Schwabach',
  'Zirndorf',
  'Herzogenaurach',
  'Lauf an der Pegnitz',
  'Roth',
  'Metropolregion Nürnberg',
];

/**
 * Build consistent Next.js Metadata for a public page.
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} opts.canonical
 * @param {Record<string, string>} [opts.languages]
 * @param {boolean} [opts.noIndex]
 */
export function buildPageMetadata({
  title,
  description,
  canonical,
  languages,
  noIndex = false,
}) {
  return {
    title,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: 'website',
      images: [{ url: OG_IMAGE, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
