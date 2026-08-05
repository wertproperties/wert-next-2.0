import DatenschutzPage from '@/components/pages/DatenschutzPage';
import { BASE_URL, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const canonical = `${BASE_URL}/${lang}/datenschutz`;

  return {
    title: `Datenschutzerklärung | ${SITE_NAME}`,
    description:
      'Datenschutzerklärung von Hausverwaltung WERT – Informationen zum Schutz Ihrer Daten.',
    alternates: {
      canonical,
      languages: {
        de: `${BASE_URL}/de/datenschutz`,
        en: `${BASE_URL}/en/datenschutz`,
        'x-default': `${BASE_URL}/de/datenschutz`,
      },
    },
    openGraph: {
      title: `Datenschutzerklärung | ${SITE_NAME}`,
      description: 'Datenschutzerklärung von Hausverwaltung WERT.',
      url: canonical,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <DatenschutzPage />;
}
