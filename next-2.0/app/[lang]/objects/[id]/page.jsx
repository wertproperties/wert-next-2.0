import ObjectDetailPage from '@/components/pages/ObjectDetailPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, PAGE_SEO, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const slug = lang === 'de' ? 'objekte' : 'objects';
  const canonical = `${BASE_URL}/${lang}/${slug}/${id}`;

  return buildPageMetadata({
    title: PAGE_SEO.objectDetail.title,
    description: PAGE_SEO.objectDetail.description,
    canonical,
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
