import { notFound } from 'next/navigation';
import LocationPage from '@/components/pages/LocationPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, buildPageMetadata } from '@/lib/seo';
import { getLocationBySlug, getAllLocationSlugs } from '@/lib/locations';

export async function generateStaticParams() {
  return getAllLocationSlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }) {
  const { lang, city } = await params;
  const location = getLocationBySlug(city);
  if (!location) return {};

  const slug = lang === 'de' ? 'standorte' : 'locations';
  const canonical = `${BASE_URL}/${lang}/${slug}/${city}`;
  const isDe = lang === 'de';

  return buildPageMetadata({
    title: isDe ? location.seoTitle.de : location.seoTitle.en,
    description: isDe ? location.seoDescription.de : location.seoDescription.en,
    canonical,
    languages: {
      de: `${BASE_URL}/de/standorte/${city}`,
      en: `${BASE_URL}/en/locations/${city}`,
      'x-default': `${BASE_URL}/de/standorte/${city}`,
    },
  });
}

export default async function Page({ params }) {
  const { lang, city } = await params;
  const location = getLocationBySlug(city);
  if (!location) notFound();

  const slug = lang === 'de' ? 'standorte' : 'locations';
  const name = lang === 'de' ? location.name : location.nameEn;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${BASE_URL}/${lang}` },
          {
            name: lang === 'de' ? 'Standorte' : 'Locations',
            url: `${BASE_URL}/${lang}/${slug}`,
          },
          {
            name,
            url: `${BASE_URL}/${lang}/${slug}/${city}`,
          },
        ]}
      />
      <LocationPage location={location} />
    </>
  );
}
