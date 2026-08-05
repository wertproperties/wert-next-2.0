import ObjectsPage from '@/components/pages/ObjectsPage';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { BASE_URL, PAGE_SEO, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const slug = lang === 'de' ? 'objekte' : 'objects';
  const canonical = `${BASE_URL}/${lang}/${slug}`;

  return buildPageMetadata({
    title: PAGE_SEO.objects.title,
    description: PAGE_SEO.objects.description,
    canonical,
    languages: {
      de: `${BASE_URL}/de/objekte`,
      en: `${BASE_URL}/en/objects`,
      'x-default': `${BASE_URL}/de/objekte`,
    },
  });
}

export default async function Page({ params }) {
  const { lang } = await params;
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
        ]}
      />
      <ObjectsPage />
    </>
  );
}
