import LocationPage from '@/components/pages/LocationPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, getPageSeo, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const seo = await getPageSeo('locations', lang);
  const pathSlug = lang === 'de' ? 'standorte' : 'locations';
  const canonical = seo.canonical || `${BASE_URL}/${lang}/${pathSlug}`;

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical,
    ogImage: seo.ogImage,
    noIndex: seo.noIndex,
    languages: {
      de: `${BASE_URL}/de/standorte`,
      en: `${BASE_URL}/en/locations`,
      'x-default': `${BASE_URL}/de/standorte`,
    },
  });
}

export default async function Page({ params }) {
  const { lang } = await params;
  const slug = lang === 'de' ? 'standorte' : 'locations';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${BASE_URL}/${lang}` },
          {
            name: lang === 'de' ? 'Standorte' : 'Locations',
            url: `${BASE_URL}/${lang}/${slug}`,
          },
        ]}
      />
      <LocationPage />
    </>
  );
}
