import translations from '@/lib/translations';
import ContactPage from '@/components/pages/ContactPage';
import { BASE_URL, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  // German-market SEO regardless of UI language
  const cp = translations.de.pages.contact;
  const slug = lang === 'de' ? 'kontakt' : 'contact';
  const canonical = `${BASE_URL}/${lang}/${slug}`;

  return {
    title: `${cp.title} | ${SITE_NAME}`,
    description: cp.heroDesc,
    alternates: {
      canonical,
      languages: {
        de: `${BASE_URL}/de/kontakt`,
        en: `${BASE_URL}/en/contact`,
        'x-default': `${BASE_URL}/de/kontakt`,
      },
    },
    openGraph: {
      title: `${cp.title} | ${SITE_NAME}`,
      description: cp.heroDesc,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cp.title} | ${SITE_NAME}`,
      description: cp.heroDesc,
    },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <ContactPage />;
}
