import ImpressumPage from '@/components/pages/ImpressumPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, getPageSeo, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const seo = await getPageSeo('impressum', lang);
  const canonical = seo.canonical || `${BASE_URL}/${lang}/impressum`;

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical,
    ogImage: seo.ogImage,
    noIndex: seo.noIndex,
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
