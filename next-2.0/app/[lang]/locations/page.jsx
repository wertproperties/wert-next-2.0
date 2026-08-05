import LocationPage from '@/components/pages/LocationPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, PAGE_SEO, buildPageMetadata } from '@/lib/seo';
import { LOCATIONS } from '@/lib/locations';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const slug = lang === 'de' ? 'standorte' : 'locations';
  const canonical = `${BASE_URL}/${lang}/${slug}`;

  return buildPageMetadata({
    title: PAGE_SEO.locations.title,
    description: PAGE_SEO.locations.description,
    canonical,
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

