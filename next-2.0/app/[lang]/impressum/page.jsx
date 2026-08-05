import ImpressumPage from '@/components/pages/ImpressumPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, PAGE_SEO, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const canonical = `${BASE_URL}/${lang}/impressum`;

  return buildPageMetadata({
    title: PAGE_SEO.impressum.title,
    description: PAGE_SEO.impressum.description,
    canonical,
    languages: {
      de: `${BASE_URL}/de/impressum`,
      en: `${BASE_URL}/en/impressum`,
      'x-default': `${BASE_URL}/de/impressum`,
    },
  });
}

export default async function Page({ params }) {
  const { lang } = await params;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${BASE_URL}/${lang}` },
          { name: 'Impressum', url: `${BASE_URL}/${lang}/impressum` },
        ]}
      />
      <ImpressumPage />
    </>
  );
}
