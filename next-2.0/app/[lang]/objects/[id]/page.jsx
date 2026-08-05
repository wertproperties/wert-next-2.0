import ObjectDetailPage from '@/components/pages/ObjectDetailPage';
import { BASE_URL, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const slug = lang === 'de' ? 'objekte' : 'objects';
  const canonical = `${BASE_URL}/${lang}/${slug}/${id}`;

  return {
    title: `Objektdetails | ${SITE_NAME}`,
    description: 'Details zum verwalteten Objekt von Hausverwaltung WERT.',
    alternates: {
      canonical,
      languages: {
        de: `${BASE_URL}/de/objekte/${id}`,
        en: `${BASE_URL}/en/objects/${id}`,
        'x-default': `${BASE_URL}/de/objekte/${id}`,
      },
    },
    openGraph: {
      title: `Objektdetails | ${SITE_NAME}`,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ObjectDetailPage />;
}
