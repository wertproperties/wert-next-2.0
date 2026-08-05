import translations from '@/lib/translations';
import ObjectsPage from '@/components/pages/ObjectsPage';
import { BASE_URL, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  // German-market SEO regardless of UI language
  const op = translations.de.pages.objects;
  const slug = lang === 'de' ? 'objekte' : 'objects';
  const canonical = `${BASE_URL}/${lang}/${slug}`;

  return {
    title: `${op.title} | ${SITE_NAME}`,
    description: op.heroDesc,
    alternates: {
      canonical,
      languages: {
        de: `${BASE_URL}/de/objekte`,
        en: `${BASE_URL}/en/objects`,
        'x-default': `${BASE_URL}/de/objekte`,
      },
    },
    openGraph: {
      title: `${op.title} | ${SITE_NAME}`,
      description: op.heroDesc,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${op.title} | ${SITE_NAME}`,
      description: op.heroDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ObjectsPage />;
}
