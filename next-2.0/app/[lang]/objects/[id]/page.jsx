import ObjectDetailPage from '@/components/pages/ObjectDetailPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, getStaticSeo, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  // No per-object CMS slug yet — static fallback only
  const seo = getStaticSeo('objectDetail', lang);
  const pathSlug = lang === 'de' ? 'objekte' : 'objects';
  const canonical = `${BASE_URL}/${lang}/${pathSlug}/${id}`;

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical,
    ogImage: seo.ogImage,
    noIndex: seo.noIndex,
    languages: {
      de: `${BASE_URL}/de/objekte/${id}`,
      en: `${BASE_URL}/en/objects/${id}`,
      'x-default': `${BASE_URL}/de/objekte/${id}`,
    },
  });
}

export default async function Page({ params }) {
  const { lang, id } = await params;
  const slug = lang === 'de' ? 'objekte' : 'objects';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${BASE_URL}/${lang}` },
          {
            name: lang === 'de' ? 'Objekte' : 'Properties',
            url: `${BASE_URL}/${lang}/${slug}`,
          },
          {
            name: lang === 'de' ? 'Objektdetails' : 'Property Details',
            url: `${BASE_URL}/${lang}/${slug}/${id}`,
          },
        ]}
      />
      <ObjectDetailPage />
    </>
  );
}
