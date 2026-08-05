import HomePage from '@/components/pages/HomePage';
import { BASE_URL, HOME_SEO, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const canonical = `${BASE_URL}/${lang}`;

  return {
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    alternates: {
      canonical,
      languages: {
        de: `${BASE_URL}/de`,
        en: `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/de`,
      },
    },
    openGraph: {
      title: HOME_SEO.title,
      description: HOME_SEO.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: HOME_SEO.title,
      description: HOME_SEO.description,
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <HomePage />;
}
