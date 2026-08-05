import { BASE_URL, SITE_NAME, SERVICE_AREA, HOME_SEO } from '@/lib/seo';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from '@/lib/site';

const ORG_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

function JsonLdScript({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + LocalBusiness (RealEstateAgent) for local SEO. */
export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness', 'Organization'],
    '@id': ORG_ID,
    name: SITE_NAME,
    legalName: SITE_NAME,
    image: `${BASE_URL}/images/logo.png`,
    logo: `${BASE_URL}/images/logo.png`,
    url: BASE_URL,
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    description: HOME_SEO.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_ADDRESS.street,
      addressLocality: 'Zirndorf',
      postalCode: '90513',
      addressRegion: 'Bayern',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.4447,
      longitude: 10.9575,
    },
    areaServed: SERVICE_AREA.map((name) => ({
      '@type': 'City',
      name,
    })),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
    priceRange: '$$',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Bank Transfer',
    knowsLanguage: ['de', 'en'],
    sameAs: [],
  };

  return <JsonLdScript data={schema} />;
}

/** WebSite schema with language alternates. */
export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: BASE_URL,
    description: HOME_SEO.description,
    publisher: { '@id': ORG_ID },
    inLanguage: ['de-DE', 'en'],
  };

  return <JsonLdScript data={schema} />;
}

/** Service offerings for the services page / homepage. */
export function ServicesJsonLd() {
  const services = [
    {
      name: 'WEG-Verwaltung',
      description:
        'Professionelle Wohnungseigentumsverwaltung in Nürnberg und der Metropolregion — Eigentümerversammlungen, Wirtschaftsplan, Jahresabrechnung.',
    },
    {
      name: 'Sondereigentumsverwaltung',
      description:
        'Individuelle Verwaltung von Sondereigentum inkl. Mieterbetreuung, Mietinkasso und Betriebskostenabrechnung.',
    },
    {
      name: 'Mietverwaltung',
      description:
        'Vollständige Mietverwaltung — Vermarktung, Bonitätsprüfung, Mietverträge und laufende Betreuung.',
    },
    {
      name: 'Gewerbeverwaltung',
      description:
        'Verwaltung von Büro-, Einzelhandels- und Lagerflächen in der Metropolregion Nürnberg.',
    },
    {
      name: 'Mischverwaltung',
      description:
        'Kombinierte Verwaltung von Wohn- und Gewerbeeinheiten mit getrennter Abrechnung.',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.name,
        description: s.description,
        provider: { '@id': ORG_ID },
        areaServed: SERVICE_AREA.map((name) => ({
          '@type': 'City',
          name,
        })),
        serviceType: 'Property Management',
      },
    })),
  };

  return <JsonLdScript data={schema} />;
}

/** BreadcrumbList for internal pages. */
export function BreadcrumbJsonLd({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript data={schema} />;
}

/** FAQPage schema — only render when matching visible FAQ content exists. */
export function FaqJsonLd({ faqs }) {
  if (!faqs?.length) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLdScript data={schema} />;
}
