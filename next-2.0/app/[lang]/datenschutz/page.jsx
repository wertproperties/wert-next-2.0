import DatenschutzPage from '@/components/pages/DatenschutzPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, getPageSeo, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const seo = await getPageSeo('datenschutz', lang);
  const canonical = seo.canonical || `${BASE_URL}/${lang}/datenschutz`;

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical,
    ogImage: seo.ogImage,
    noIndex: seo.noIndex,
    languages: {
      de: `${BASE_URL}/de/datenschutz`,
      en: `${BASE_URL}/en/datenschutz`,
      'x-default': `${BASE_URL}/de/datenschutz`,
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
          {
            name: 'Datenschutz',
            url: `${BASE_URL}/${lang}/datenschutz`,
          },
        ]}
      />
      <DatenschutzPage />
    </>
  );
}
