import ImpressumPage from '@/components/pages/ImpressumPage';
import { BASE_URL, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const canonical = `${BASE_URL}/${lang}/impressum`;

  return {
    title: `Impressum | ${SITE_NAME}`,
    description: 'Impressum und rechtliche Informationen von Hausverwaltung WERT.',
    alternates: {
      canonical,
      languages: {
        de: `${BASE_URL}/de/impressum`,
        en: `${BASE_URL}/en/impressum`,
        'x-default': `${BASE_URL}/de/impressum`,
      },
    },
    openGraph: {
      title: `Impressum | ${SITE_NAME}`,
      description: 'Impressum und rechtliche Informationen von Hausverwaltung WERT.',
      url: canonical,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ImpressumPage />;
}
