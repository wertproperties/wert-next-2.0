import ServicesPage from '@/components/pages/ServicesPage';
import { BreadcrumbJsonLd, ServicesJsonLd } from '@/components/JsonLd';
import { BASE_URL, getPageSeo, buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const seo = await getPageSeo('services', lang);
  const pathSlug = lang === 'de' ? 'leistungen' : 'services';
  const canonical = seo.canonical || `${BASE_URL}/${lang}/${pathSlug}`;

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical,
    ogImage: seo.ogImage,
    noIndex: seo.noIndex,
    languages: {
      de: `${BASE_URL}/de/leistungen`,
      en: `${BASE_URL}/en/services`,
      'x-default': `${BASE_URL}/de/leistungen`,
    },
  });
}

export default async function Page({ params }) {
  const { lang } = await params;
  const slug = lang === 'de' ? 'leistungen' : 'services';

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${BASE_URL}/${lang}` },
          {
            name: lang === 'de' ? 'Leistungen' : 'Services',
            url: `${BASE_URL}/${lang}/${slug}`,
          },
        ]}
      />
      <ServicesJsonLd />
      <ServicesPage />
    </>
  );
}
