import translations from '@/lib/translations';
import ServicesPage from '@/components/pages/ServicesPage';
import { BASE_URL, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  // German-market SEO regardless of UI language
  const sp = translations.de.pages.services;
  const slug = lang === 'de' ? 'leistungen' : 'services';
  const canonical = `${BASE_URL}/${lang}/${slug}`;

  return {
    title: `${sp.title} | ${SITE_NAME}`,
    description: sp.heroDesc,
    alternates: {
      canonical,
      languages: {
        de: `${BASE_URL}/de/leistungen`,
        en: `${BASE_URL}/en/services`,
        'x-default': `${BASE_URL}/de/leistungen`,
      },
    },
    openGraph: {
      title: `${sp.title} | ${SITE_NAME}`,
      description: sp.heroDesc,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${sp.title} | ${SITE_NAME}`,
      description: sp.heroDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ServicesPage />;
}
