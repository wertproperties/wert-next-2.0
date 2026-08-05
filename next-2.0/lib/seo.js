/**
 * Site-wide SEO defaults + dynamic fetch from backend PageSeo API.
 * Falls back to static HOME_SEO / PAGE_SEO when the API is unavailable.
 */

export const SITE_NAME = 'Hausverwaltung WERT';
export const BASE_URL = 'https://www.hausverwaltungwert.de';
export const OG_IMAGE = `${BASE_URL}/images/logo.png`;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/** Primary homepage metadata (static fallback). */
export const HOME_SEO = {
  title:
    'Property Management Nuremberg | HOA, Residential & Commercial Management | Hausverwaltung WERT',
  description:
    'Professional property management for HOAs, residential rentals, and commercial properties in Nuremberg and the surrounding area. Hausverwaltung WERT stands for personalized service, transparent communication, and reliable management.',
};

/**
 * German-market page metadata — static fallback when API is down.
 */
export const PAGE_SEO = {
  home: {
    titleDe: `Hausverwaltung Nürnberg | WEG, Wohn- & Gewerbeverwaltung | ${SITE_NAME}`,
    descriptionDe:
      'Professionelle Hausverwaltung für WEG, Mietwohnungen und Gewerbeimmobilien in Nürnberg und der Metropolregion. Hausverwaltung WERT steht für persönlichen Service, transparente Kommunikation und zuverlässige Verwaltung.',
    titleEn: HOME_SEO.title,
    descriptionEn: HOME_SEO.description,
  },
  services: {
    titleDe: `Hausverwaltung Leistungen Nürnberg | WEG, Miet- & Gewerbeverwaltung | ${SITE_NAME}`,
    descriptionDe:
      'Professionelle Hausverwaltung in Nürnberg und der Metropolregion: WEG-Verwaltung, Sondereigentum, Mietverwaltung und Gewerbeverwaltung — persönlich, transparent und zuverlässig.',
    titleEn: `Property Management Services Nuremberg | HOA, Rental & Commercial | ${SITE_NAME}`,
    descriptionEn:
      'Professional property management services in Nuremberg and the metro region: HOA management, individual units, rentals and commercial properties.',
  },
  objects: {
    titleDe: `Verwaltete Objekte Nürnberg | Wohn- & Gewerbeimmobilien | ${SITE_NAME}`,
    descriptionDe:
      'Einblick in Wohn- und Gewerbeimmobilien unter Verwaltung von Hausverwaltung WERT in Nürnberg und der Metropolregion Nürnberg.',
    titleEn: `Managed Properties Nuremberg | Residential & Commercial | ${SITE_NAME}`,
    descriptionEn:
      'A selection of residential and commercial properties managed by Hausverwaltung WERT in Nuremberg and the metro region.',
  },
  contact: {
    titleDe: `Kontakt Hausverwaltung Nürnberg | ${SITE_NAME}`,
    descriptionDe:
      'Kontaktieren Sie Hausverwaltung WERT in Zirndorf bei Nürnberg — persönliche Beratung zu WEG-, Miet- und Gewerbeverwaltung in der Metropolregion.',
    titleEn: `Contact Property Management Nuremberg | ${SITE_NAME}`,
    descriptionEn:
      'Get in touch with Hausverwaltung WERT in Zirndorf near Nuremberg — personal advice on HOA, rental and commercial management.',
  },
  impressum: {
    titleDe: `Impressum | ${SITE_NAME}`,
    descriptionDe: 'Impressum und rechtliche Informationen von Hausverwaltung WERT, Zirndorf / Nürnberg.',
    titleEn: `Legal Notice (Impressum) | ${SITE_NAME}`,
    descriptionEn: 'Legal notice and company information for Hausverwaltung WERT, Zirndorf / Nuremberg.',
  },
  datenschutz: {
    titleDe: `Datenschutzerklärung | ${SITE_NAME}`,
    descriptionDe:
      'Datenschutzerklärung von Hausverwaltung WERT – Informationen zum Schutz Ihrer personenbezogenen Daten.',
    titleEn: `Privacy Policy | ${SITE_NAME}`,
    descriptionEn: 'Privacy policy of Hausverwaltung WERT – information on how we protect your personal data.',
  },
  objectDetail: {
    titleDe: `Objektdetails | ${SITE_NAME}`,
    descriptionDe:
      'Details zu einem von Hausverwaltung WERT verwalteten Objekt in Nürnberg und Umgebung.',
    titleEn: `Property Details | ${SITE_NAME}`,
    descriptionEn:
      'Details of a property managed by Hausverwaltung WERT in Nuremberg and the surrounding area.',
  },
  locations: {
    titleDe: `Standorte & Servicegebiet | Hausverwaltung Metropolregion Nürnberg | ${SITE_NAME}`,
    descriptionDe:
      'Hausverwaltung WERT betreut Immobilien in Nürnberg und der gesamten Metropolregion — inkl. Fürth, Erlangen, Schwabach, Zirndorf und Umgebung.',
    titleEn: `Locations & Service Area | Property Management Nuremberg Metro | ${SITE_NAME}`,
    descriptionEn:
      'Hausverwaltung WERT manages properties in Nuremberg and the entire metropolitan region — including Fürth, Erlangen, Schwabach, Zirndorf and surrounding areas.',
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

/** Static fallback for a slug + language. */
export function getStaticSeo(slug, lang = 'de') {
  const entry = PAGE_SEO[slug] || PAGE_SEO.home;
  const isDe = lang !== 'en';
  return {
    title: (isDe ? entry.titleDe : entry.titleEn) || entry.titleDe || HOME_SEO.title,
    description:
      (isDe ? entry.descriptionDe : entry.descriptionEn) ||
      entry.descriptionDe ||
      HOME_SEO.description,
    ogImage: OG_IMAGE,
    canonical: '',
    noIndex: false,
  };
}

/**
 * Fetch SEO for a page slug from the backend.
 * Falls back to lib/seo.js static defaults on any error.
 *
 * @param {string} slug - e.g. 'home', 'services', 'contact'
 * @param {string} lang - 'de' | 'en'
 * @returns {Promise<{ title: string, description: string, ogImage: string, canonical: string, noIndex: boolean }>}
 */
export async function getPageSeo(slug, lang = 'de') {
  const fallback = getStaticSeo(slug, lang);

  try {
    const res = await fetch(`${API_BASE}/seo/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;

    const json = await res.json();
    const data = json?.data;
    if (!data) return fallback;

    const isDe = lang !== 'en';
    return {
      title:
        (isDe ? data.titleDe : data.titleEn)?.trim() || fallback.title,
      description:
        (isDe ? data.descriptionDe : data.descriptionEn)?.trim() ||
        fallback.description,
      ogImage: data.ogImage?.trim() || fallback.ogImage,
      canonical: data.canonical?.trim() || fallback.canonical,
      noIndex: !!data.noIndex,
    };
  } catch {
    return fallback;
  }
}

/**
 * Build consistent Next.js Metadata for a public page.
 */
export function buildPageMetadata({
  title,
  description,
  canonical,
  languages,
  noIndex = false,
  ogImage = OG_IMAGE,
}) {
  const image = ogImage || OG_IMAGE;
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
      images: [{ url: image, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
